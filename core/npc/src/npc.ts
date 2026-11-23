import type { IAddictions, IAddictionsFactory } from '@peetland/addictions';
import { AbortController } from '@peetland/events';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN, IHTNFactory } from '@peetland/htn';
import type { IInventoryFactory, Inventory } from '@peetland/inventory';
import type {
  INeeds,
  INeedsFactory,
  IUrgencyWatcher,
  IUrgencyWatcherFactory,
} from '@peetland/needs';
import type { IPsyche, IPsycheFactory } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import type { NpcKind } from './kind';
import type { IRootTaskFactory } from './root-task-factory';
import type { NpcState } from './state';
import type { INpcWorldKnowledge } from './world-knowledge';

/** Реестр связей «актор ↔ NPC»: тело ↔ личность */
export interface IActorNpcRegistry {
  /** Связывает актора с NPC и убирает связь, когда сигнал прерван */
  register(actor: IActor, npc: Npc, signal: IAbortSignal): void;

  /** Возвращает актора, который является телом NPC */
  getActor(npc: Npc): IActor | undefined;

  /** Возвращает NPC, чьим телом является актор */
  getNpc(actor: IActor): Npc | undefined;
}

export type NpcDeps = {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** Реестр, в котором NPC связывает своего актора с собой */
  actorNpcRegistry: IActorNpcRegistry;
  /** Фабрика, которой NPC создаёт своего HTN-агента. Агент сам планирует и перепланирует задачи */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Фабрика, которой NPC создаёт свой инвентарь */
  inventoryFactory: IInventoryFactory;
  /** Фабрика, которой NPC создаёт свою психику */
  psycheFactory: IPsycheFactory;
  /** Фабрика, которой NPC создаёт свои потребности */
  needsFactory: INeedsFactory;
  /** Фабрика, которой NPC создаёт свои зависимости */
  addictionsFactory: IAddictionsFactory;
  /** Фабрика, которой NPC создаёт наблюдателя, который следит, когда потребности становятся срочными */
  urgencyWatcherFactory: IUrgencyWatcherFactory;
  /** Фабрика, которой NPC создаёт корневую задачу своего HTN-агента по своему типу */
  rootTaskFactory: IRootTaskFactory;
  /** Сообщает о каждом тике мира */
  ticks: Observable<unknown>;
  /** То, что NPC знает о мире */
  worldKnowledge: INpcWorldKnowledge;
  /** Переходит в состояние aborted, когда игра завершается. Тогда NPC деспавнится */
  gameSignal: IAbortSignal;
};

/** NPC склеивает свои данные, актора и HTN-агента */
export class Npc {
  readonly id: string;
  readonly kind: NpcKind;
  readonly inventory: Inventory;
  readonly psyche: IPsyche;
  readonly needs: INeeds;
  readonly addictions: IAddictions;

  private readonly actor: IActor;
  private readonly context: NpcContext;
  private readonly htn: IHTN<NpcState, NpcContext>;
  private readonly lifetime: AbortController;
  private readonly urgencyWatcher: IUrgencyWatcher;
  private readonly worldKnowledge: INpcWorldKnowledge;

  /**
   * Создаёт актора, инвентарь, психику, потребности, зависимости и HTN-агента по данным NPC и каждый
   * тик передаёт агенту актуальное состояние и контекст с ними. Потребности начинают падать, а тяга
   * зависимостей расти со времени, которое NPC знает о мире в момент создания. Когда игра завершается, деспавнится, а если она уже
   * завершилась, деспавнится сразу
   * @param data - данные NPC
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const {
      actorFactory,
      actorNpcRegistry,
      ticks,
      htnFactory,
      inventoryFactory,
      psycheFactory,
      needsFactory,
      addictionsFactory,
      urgencyWatcherFactory,
      rootTaskFactory,
      gameSignal,
      worldKnowledge,
    } = deps;
    const { time } = worldKnowledge.getState();

    this.id = data.id;
    this.kind = data.kind;
    this.worldKnowledge = worldKnowledge;
    this.inventory = inventoryFactory.create(data.inventory);
    this.psyche = psycheFactory.create(data.psyche);
    this.needs = needsFactory.create(data.needs, time);
    this.addictions = addictionsFactory.create(data.addictions, time);
    this.urgencyWatcher = urgencyWatcherFactory.create();
    this.lifetime = new AbortController();
    this.actor = actorFactory.create({
      modelId: data.modelId,
      position: data.spawnPosition,
      angle: data.spawnAngle,
    });
    actorNpcRegistry.register(this.actor, this, this.lifetime.signal);
    this.context = {
      actor: this.actor,
      inventory: this.inventory,
      psyche: this.psyche,
      needs: this.needs,
      addictions: this.addictions,
    };
    this.htn = htnFactory.create(rootTaskFactory.create(data.kind));

    ticks.subscribe(() => this.tick(), { signal: this.lifetime.signal });

    if (gameSignal.aborted) {
      this.despawn();
      return;
    }

    gameSignal.addEventListener('abort', () => this.despawn(), {
      once: true,
      signal: this.lifetime.signal,
    });
  }

  /** Возвращает состояние NPC: слепок самого NPC и то, что он знает о мире (см. NpcState) */
  getState(): NpcState {
    return {
      self: {
        kind: this.kind,
        actor: {
          position: this.actor.getPosition(),
          angle: this.actor.getAngle(),
        },
        inventory: this.inventory,
        psyche: this.psyche,
        needs: this.needs,
        addictions: this.addictions,
      },
      world: this.worldKnowledge.getState(),
    };
  }

  /**
   * Продвигает HTN-агента на тик. Если потребность только что стала срочной, сначала мягко
   * останавливает текущий план: так агент доделает транзакции и перепланирует, и слой потребностей
   * успеет её удовлетворить
   */
  private tick(): void {
    const state = this.getState();

    if (this.urgencyWatcher.check(state.self.needs, state.world.time)) {
      this.htn.softStop();
    }

    this.htn.update(state, this.context);
  }

  /**
   * Завершает жизнь NPC: перестаёт следить за тиками, останавливает HTN-агента и деспавнит
   * актора. После деспавна NPC больше не пользуются
   */
  despawn(): void {
    this.lifetime.abort();
    this.htn.stop(this.context);
    this.actor.despawn();
  }
}
