import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TRY_LUCK_PERIOD, TryLuckTask } from '../../../src/try-luck-task';

describe('TryLuckTask', () => {
  describe('#start', () => {
    it('Просит психику NPC поправить базовый шанс', () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random: createMockedRandom(false),
          timer,
        }
      );
      const psyche = createMockedPsyche();

      task.start(NpcStateBuilder.default(), {
        ...createNpcContext(),
        psyche,
      });
      timer.advance(TRY_LUCK_PERIOD);

      expect(psyche.adjustChance).toHaveBeenCalledExactlyOnceWith(1 / 60);
    });

    it('Бросает шанс, который поправила психика NPC', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random,
          timer,
        }
      );
      const psyche = createMockedPsyche();
      psyche.adjustChance.mockReturnValue(1 / 30);

      task.start(NpcStateBuilder.default(), {
        ...createNpcContext(),
        psyche,
      });
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledExactlyOnceWith(1 / 30);
    });
  });
});
