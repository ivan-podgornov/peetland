import { AbortController } from '@peetland/events';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN, IHTNFactory } from '@peetland/htn';
import type { IInventoryFactory, Inventory } from '@peetland/inventory';
import type { IPsyche, IPsycheFactory } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import type { IRootTaskFactory } from './root-task-factory';
import type { NpcState } from './state';
import type { INpcWorldKnowledge } from './world-knowledge';

export type NpcDeps = {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** Фабрика, которой NPC создаёт своего HTN-агента. Агент сам планирует и перепланирует задачи */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Фабрика, которой NPC создаёт свой инвентарь */
  inventoryFactory: IInventoryFactory;
  /** Фабрика, которой NPC создаёт свою психику */
  psycheFactory: IPsycheFactory;
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
  readonly inventory: Inventory;
  readonly psyche: IPsyche;

  private readonly actor: IActor;
  private readonly context: NpcContext;
  private readonly htn: IHTN<NpcState, NpcContext>;
  private readonly lifetime: AbortController;
  private readonly worldKnowledge: INpcWorldKnowledge;

  /**
   * Создаёт актора, инвентарь, психику и HTN-агента по данным NPC и каждый тик передаёт агенту актуальное состояние и
   * контекст с актором, инвентарём и психикой. Когда игра завершается, деспавнится, а если она уже
   * завершилась, деспавнится сразу
   * @param data - данные NPC
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const {
      actorFactory,
      ticks,
      htnFactory,
      inventoryFactory,
      psycheFactory,
      rootTaskFactory,
      gameSignal,
      worldKnowledge,
    } = deps;

    this.id = data.id;
    this.worldKnowledge = worldKnowledge;
    this.inventory = inventoryFactory.create(data.inventory);
    this.psyche = psycheFactory.create(data.psyche);
    this.lifetime = new AbortController();
    this.actor = actorFactory.create({
      modelId: data.modelId,
      position: data.spawnPosition,
      angle: data.spawnAngle,
    });
    this.context = {
      actor: this.actor,
      inventory: this.inventory,
      psyche: this.psyche,
    };
    this.htn = htnFactory.create(rootTaskFactory.create(data.kind));

    ticks.subscribe(() => this.htn.update(this.getState(), this.context), {
      signal: this.lifetime.signal,
    });

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
        actor: {
          position: this.actor.getPosition(),
          angle: this.actor.getAngle(),
        },
        inventory: this.inventory,
        psyche: this.psyche,
      },
      world: this.worldKnowledge.getState(),
    };
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
