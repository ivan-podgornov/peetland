import type { INpcWorldKnowledge, NpcWorldState } from '@peetland/npc';
import type { IReadonlyTime } from '@peetland/timings';

export type NpcWorldKnowledgeDeps = {
  /** Время суток, которое знают NPC */
  time: IReadonlyTime;
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
}
