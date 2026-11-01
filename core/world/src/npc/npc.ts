import { AbortController } from '@peetland/events';
import type { Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN, IHTNFactory, Task } from '@peetland/htn';
import type { IInventoryFactory, Inventory } from '@peetland/inventory';

import type { NpcContext } from './context';
import type { NpcData, NpcFeelings, NpcTraits } from './data';
import type { NpcState } from './state';

export type NpcDeps = {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** Фабрика, которой NPC создаёт своего HTN-агента. Агент сам планирует и перепланирует задачи */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Фабрика, которой NPC создаёт свой инвентарь */
  inventoryFactory: IInventoryFactory;
  /** Корневая задача, которую планирует HTN-агент NPC */
  rootTask: Task<NpcState, NpcContext>;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
};

/** NPC склеивает свои данные, актора и HTN-агента */
export class Npc {
  readonly id: string;
  readonly inventory: Inventory;
  readonly traits: NpcTraits;
  readonly feelings: NpcFeelings;

  private readonly actor: IActor;
  private readonly context: NpcContext;
  private readonly htn: IHTN<NpcState, NpcContext>;
  private readonly lifetime: AbortController;

  /**
   * Создаёт актора и HTN-агента по данным NPC и каждый кадр передаёт агенту актуальное состояние и
   * контекст с актором и инвентарём
   * @param data - данные NPC
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const { actorFactory, frames, htnFactory, inventoryFactory, rootTask } = deps;

    this.id = data.id;
    this.inventory = inventoryFactory.create(data.inventory);
    this.traits = data.traits;
    this.feelings = data.feelings;
    this.lifetime = new AbortController();
    this.actor = actorFactory.create({
      modelId: data.modelId,
      position: data.spawnPosition,
      angle: data.spawnAngle,
    });
    this.context = { actor: this.actor, inventory: this.inventory };
    this.htn = htnFactory.create(rootTask);

    frames.subscribe(() => this.htn.update(this.getState(), this.context), {
      signal: this.lifetime.signal,
    });
  }

  /** Возвращает состояние NPC со слепками актора и инвентаря (см. NpcState) */
  getState(): NpcState {
    return {
      actor: { position: this.actor.getPosition(), angle: this.actor.getAngle() },
      inventory: this.inventory.getAll(),
      traits: this.traits,
      feelings: this.feelings,
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
