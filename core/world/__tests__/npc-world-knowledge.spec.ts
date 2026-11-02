import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { NpcWorldKnowledge } from '../src/npc-world-knowledge';

describe('NpcWorldKnowledge', () => {
  describe('#getState', () => {
    it('Возвращает время суток в минутах от полуночи', () => {
      const knowledge = new NpcWorldKnowledge({ time: new ManualTime(20, 15) });

      expect(knowledge.getState().time).toBe(20 * 60 + 15);
    });

    it('Возвращает слепок, который не меняется, когда идёт время', () => {
      const time = new ManualTime(20, 15);
      const knowledge = new NpcWorldKnowledge({ time });
      const state = knowledge.getState();

      time.set(21, 0);

      expect(state.time).toBe(20 * 60 + 15);
    });
  });
});
