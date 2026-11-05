import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { TryLuckTask } from '../../../src/try-luck-task';

describe('TryLuckTask', () => {
  describe('#start', () => {
    it('При каждой попытке вызывает onAttempt с контекстом', () => {
      const onAttempt = vi.fn();
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        {
          chance: 1 / 60,
          onAttempt,
        },
        {
          random: createMockedRandom(false),
          timer,
        }
      );
      const context = createNpcContext();

      task.start(NpcStateBuilder.default(), context);
      timer.advance(TryLuckTask.PERIOD * 2);

      expect(onAttempt.mock.calls).toStrictEqual([[context], [context]]);
    });

    it('Вызывает onAttempt до броска шанса', () => {
      const onAttempt = vi.fn();
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        {
          chance: 1 / 60,
          onAttempt,
        },
        {
          random,
          timer,
        }
      );

      task.start(NpcStateBuilder.default(), createNpcContext());
      timer.advance(TryLuckTask.PERIOD);

      expect(onAttempt).toHaveBeenCalledBefore(random.chance);
    });

    it('Если повезло, вызывает onAttempt', () => {
      const onAttempt = vi.fn();
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        {
          chance: 1 / 60,
          onAttempt,
        },
        {
          random: createMockedRandom(true),
          timer,
        }
      );

      task.start(NpcStateBuilder.default(), createNpcContext());
      timer.advance(TryLuckTask.PERIOD);

      expect(onAttempt).toHaveBeenCalledOnce();
    });
  });
});
