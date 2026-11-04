import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { Modifier } from '@peetland/psyche';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TRY_LUCK_PERIOD, TryLuckTask } from '../../../src/try-luck-task';

describe('TryLuckTask', () => {
  describe('#start', () => {
    it('Бросает шанс, у которого соотношение удач и неудач умножено на модификатор шанса психики', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 0.5 },
        {
          random,
          timer,
        }
      );
      const psyche = createMockedPsyche();
      psyche.getModifier.mockImplementation((modifier) => (modifier === Modifier.Chance ? 3 : 1));

      task.start(NpcStateBuilder.default(), {
        ...createNpcContext(),
        psyche,
      });
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledExactlyOnceWith(0.75);
    });

    it('Если модификатор шанса 0, бросает шанс 0', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 0.5 },
        {
          random,
          timer,
        }
      );
      const psyche = createMockedPsyche();
      psyche.getModifier.mockReturnValue(0);

      task.start(NpcStateBuilder.default(), {
        ...createNpcContext(),
        psyche,
      });
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledExactlyOnceWith(0);
    });

    it('Если шанс 1, бросает шанс 1 при любом модификаторе', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 },
        {
          random,
          timer,
        }
      );
      const psyche = createMockedPsyche();
      psyche.getModifier.mockReturnValue(0);

      task.start(NpcStateBuilder.default(), {
        ...createNpcContext(),
        psyche,
      });
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledExactlyOnceWith(1);
    });
  });
});
