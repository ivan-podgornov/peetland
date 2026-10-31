import { AbortController } from '@peetland/events';
import type { Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN } from '@peetland/htn';
import { Inventory } from '@peetland/inventory';

import type { NpcData } from './data';
import type { NpcState } from './state';

export type NpcDeps = {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** HTN-агент NPC. Планирует и перепланирует задачи сам, у каждого NPC он свой */
  htn: IHTN<NpcState>;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
};

/** NPC склеивает свои данные, актора и HTN-агента */
export class Npc {
  readonly id: string;
  readonly inventory: Inventory;
  /** Совестливость от 0 до 100. Черта характера, со временем не меняется */
  readonly conscientiousness: number;
  /** Стыд от 0 до 100 */
  readonly shame: number;

  private readonly actor: IActor;
  private readonly deps: NpcDeps;
  private readonly lifetime: AbortController;

  /**
   * Создаёт актора по данным NPC и каждый кадр передаёт HTN-агенту актуальное состояние
   * @param data - данные NPC
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const { actorFactory, frames, htn } = deps;

    this.deps = deps;
    this.id = data.id;
    this.inventory = new Inventory(data.inventory);
    this.conscientiousness = data.traits.conscientiousness;
    this.shame = data.feelings.shame;
    this.lifetime = new AbortController();
    this.actor = actorFactory.create({
      modelId: data.modelId,
      position: data.spawnPosition,
      angle: data.spawnAngle,
    });

    frames.subscribe(() => htn.update(this.getState()), { signal: this.lifetime.signal });
  }

  /** Возвращает состояние NPC с живыми инвентарём и актором (см. NpcState) */
  getState(): NpcState {
    return {
      actor: this.actor,
      inventory: this.inventory,
      conscientiousness: this.conscientiousness,
      shame: this.shame,
    };
  }

  /**
   * Завершает жизнь NPC: перестаёт следить за кадрами, останавливает HTN-агента и деспавнит
   * актора. После деспавна NPC больше не пользуются
   */
  despawn(): void {
    const { htn } = this.deps;

    this.lifetime.abort();
    htn.stop();
    this.actor.despawn();
  }
}
