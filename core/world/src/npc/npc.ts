import { AbortController } from '@peetland/events';
import type { Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN, IHTNFactory } from '@peetland/htn';
import { Inventory } from '@peetland/inventory';

import type { NpcData, NpcFeelings, NpcTraits } from './data';
import type { INpcRootTaskFactory } from './root-task';
import type { NpcState } from './state';

export type NpcDeps = {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** Фабрика, которой NPC создаёт своего HTN-агента. Агент сам планирует и перепланирует задачи */
  htnFactory: IHTNFactory<NpcState>;
  /** Фабрика корневой задачи, которую планирует HTN-агент NPC */
  rootTaskFactory: INpcRootTaskFactory;
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
  private readonly htn: IHTN<NpcState>;
  private readonly lifetime: AbortController;

  /**
   * Создаёт актора и HTN-агента по данным NPC и каждый кадр передаёт агенту актуальное состояние
   * @param data - данные NPC
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const { actorFactory, frames, htnFactory, rootTaskFactory } = deps;

    this.id = data.id;
    this.inventory = new Inventory(data.inventory);
    this.traits = data.traits;
    this.feelings = data.feelings;
    this.lifetime = new AbortController();
    this.actor = actorFactory.create({
      modelId: data.modelId,
      position: data.spawnPosition,
      angle: data.spawnAngle,
    });
    this.htn = htnFactory.create(rootTaskFactory.create(this.actor));

    frames.subscribe(() => this.htn.update(this.getState()), { signal: this.lifetime.signal });
  }

  /** Возвращает состояние NPC с живым инвентарём и слепком актора (см. NpcState) */
  getState(): NpcState {
    return {
      actor: { position: this.actor.getPosition(), angle: this.actor.getAngle() },
      inventory: this.inventory,
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
    this.htn.stop();
    this.actor.despawn();
  }
}
