import type { IGame } from '@peetland/game';
import type { IActorNpcRegistry, INpc, INpcWorldKnowledge, NpcWorldState } from '@peetland/npc';
import type { IReadonlyTime } from '@peetland/timings';

export type NpcWorldKnowledgeDeps = {
  /** Время суток, которое знают NPC */
  time: IReadonlyTime;
  /** Игра, у которой знание спрашивает видимых акторов */
  game: IGame;
  /** Реестр, в котором NPC связывают своих акторов с собой */
  actorNpcRegistry: IActorNpcRegistry;
};

/** Знание NPC о мире, которое мир собирает из своих источников */
export class NpcWorldKnowledge implements INpcWorldKnowledge {
  private readonly deps: NpcWorldKnowledgeDeps;

  constructor(deps: NpcWorldKnowledgeDeps) {
    this.deps = deps;
  }

  /** Возвращает мир с временем суток */
  getState(): NpcWorldState {
    const { time } = this.deps;

    return { time };
  }

  /** Возвращает NPC, которых видит target в радиусе radius */
  getVisibleNpcs(target: INpc, radius: number): INpc[] {
    const { actorNpcRegistry, game } = this.deps;
    const actor = actorNpcRegistry.getActor(target);

    return game
      .getVisibleActors(actor, radius)
      .map((visibleActor) => actorNpcRegistry.getNpc(visibleActor));
  }
}
