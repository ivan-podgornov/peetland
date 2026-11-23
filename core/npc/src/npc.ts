import type { IAddictions } from '@peetland/addictions';
import { AbortController } from '@peetland/events';
import type { IActor } from '@peetland/game';
import type { IHTN } from '@peetland/htn';
import type { Inventory } from '@peetland/inventory';
import type { INeeds, IUrgencyWatcher } from '@peetland/needs';
import type { IPsyche } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import type { NpcKind } from './kind';
import type { NpcState } from './state';
import type { INpc, NpcDeps } from './types';
import type { INpcWorldKnowledge } from './world-knowledge';

/** NPC склеивает свои данные, актора и HTN-агента */
export class Npc implements INpc {
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
