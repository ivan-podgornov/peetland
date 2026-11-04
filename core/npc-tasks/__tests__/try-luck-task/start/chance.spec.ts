import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { Modifier } from '@peetland/psyche';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TRY_LUCK_PERIOD, TryLuckTask } from '../../../src/try-luck-task';

describe('TryLuckTask', () => {
  describe('#start', () => {
    it('Бросает шанс, умноженный на модификатор шанса психики', () => {
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
      psyche.getModifier.mockImplementation((modifier) => (modifier === Modifier.Chance ? 1.5 : 1));

      task.start(NpcStateBuilder.default(), {
        ...createNpcContext(),
        psyche,
      });
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledExactlyOnceWith(1.5 / 60);
    });

    it('Если с модификатором шанс больше 1, бросает шанс 1', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 0.8 },
        {
          random,
          timer,
        }
      );
      const psyche = createMockedPsyche();
      psyche.getModifier.mockReturnValue(1.5);

      task.start(NpcStateBuilder.default(), {
        ...createNpcContext(),
        psyche,
      });
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledExactlyOnceWith(1);
    });
  });
});
