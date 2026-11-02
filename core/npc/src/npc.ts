import { AbortController } from '@peetland/events';
import type { Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN, IHTNFactory } from '@peetland/htn';
import type { IInventoryFactory, Inventory } from '@peetland/inventory';
import type { IPsyche, IPsycheFactory } from '@peetland/psyche';
import type { IClock } from '@peetland/timings';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import type { IRootTaskFactory } from './root-task-factory';
import type { NpcState } from './state';

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
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
  /** Часы, по которым NPC знает время суток */
  clock: IClock;
};

/** NPC склеивает свои данные, актора и HTN-агента */
export class Npc {
  readonly id: string;
  readonly inventory: Inventory;
  readonly psyche: IPsyche;

  private readonly actor: IActor;
  private readonly clock: IClock;
  private readonly context: NpcContext;
  private readonly htn: IHTN<NpcState, NpcContext>;
  private readonly lifetime: AbortController;

  /**
   * Создаёт актора, инвентарь, психику и HTN-агента по данным NPC и каждый кадр передаёт агенту актуальное состояние и
   * контекст с актором, инвентарём и психикой
   * @param data - данные NPC
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const {
      actorFactory,
      clock,
      frames,
      htnFactory,
      inventoryFactory,
      psycheFactory,
      rootTaskFactory,
    } = deps;

    this.id = data.id;
    this.clock = clock;
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

    frames.subscribe(() => this.htn.update(this.getState(), this.context), {
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
        inventory: this.inventory.getAll(),
        psyche: this.psyche.getState(),
      },
      world: { time: this.clock.minutesSinceMidnight },
    };
  }

  /**
   * Завершает жизнь NPC: перестаёт следить за кадрами, останавливает HTN-агента и деспавнит
   * актора. После деспавна NPC больше не пользуются
   */
  despawn(): void {
    this.lifetime.abort();
    this.htn.stop(this.context);
    this.actor.despawn();
  }
}
