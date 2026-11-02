import type { INpcWorldKnowledge, NpcWorldState } from '@peetland/npc';
import type { IClock } from '@peetland/timings';

export type NpcWorldKnowledgeDeps = {
  /** Часы, по которым NPC знают время суток */
  clock: IClock;
};

/** Знание NPC о мире, которое мир собирает из своих источников */
export class NpcWorldKnowledge implements INpcWorldKnowledge {
  private readonly deps: NpcWorldKnowledgeDeps;

  constructor(deps: NpcWorldKnowledgeDeps) {
    this.deps = deps;
  }

  /** Возвращает слепок мира со временем суток по часам */
  getState(): NpcWorldState {
    const { clock } = this.deps;

    return { time: clock.minutesSinceMidnight };
  }
}
