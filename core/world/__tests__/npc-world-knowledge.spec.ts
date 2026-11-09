import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { NpcWorldKnowledge } from '../src/npc-world-knowledge';

describe('NpcWorldKnowledge', () => {
  describe('#getState', () => {
    it('Возвращает время суток', () => {
      const time = new ManualTime();
      const knowledge = new NpcWorldKnowledge({ time });

      expect(knowledge.getState().time).toBe(time);
    });
  });
});
