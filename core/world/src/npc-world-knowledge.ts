import type { INpcWorldKnowledge, NpcWorldState } from '@peetland/npc';
import type { ITime } from '@peetland/timings';

export type NpcWorldKnowledgeDeps = {
  /** Время суток, которое знают NPC */
  time: ITime;
};

/** Знание NPC о мире, которое мир собирает из своих источников */
export class NpcWorldKnowledge implements INpcWorldKnowledge {
  private readonly deps: NpcWorldKnowledgeDeps;

  constructor(deps: NpcWorldKnowledgeDeps) {
    this.deps = deps;
  }

  /** Возвращает слепок мира с текущим временем суток */
  getState(): NpcWorldState {
    const { time } = this.deps;

    return { time: time.getState() };
  }
}
