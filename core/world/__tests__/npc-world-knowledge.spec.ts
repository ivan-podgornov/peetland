import { ManualClock } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { NpcWorldKnowledge } from '../src/npc-world-knowledge';

describe('NpcWorldKnowledge', () => {
  describe('#getState', () => {
    it('Возвращает время суток по часам в минутах от полуночи', () => {
      const knowledge = new NpcWorldKnowledge({ clock: new ManualClock(20, 15) });

      expect(knowledge.getState().time).toBe(20 * 60 + 15);
    });

    it('Возвращает слепок, который не меняется, когда идут часы', () => {
      const clock = new ManualClock(20, 15);
      const knowledge = new NpcWorldKnowledge({ clock });
      const state = knowledge.getState();

      clock.set(21, 0);

      expect(state.time).toBe(20 * 60 + 15);
    });
  });
});
