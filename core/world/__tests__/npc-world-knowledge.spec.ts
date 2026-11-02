import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { NpcWorldKnowledge } from '../src/npc-world-knowledge';

describe('NpcWorldKnowledge', () => {
  describe('#getState', () => {
    it('Возвращает слепок времени суток', () => {
      const time = new ManualTime({
        hours: 20,
        minutes: 15,
      });
      const knowledge = new NpcWorldKnowledge({ time });

      expect(knowledge.getState().time).toStrictEqual(time.getState());
    });
  });
});
