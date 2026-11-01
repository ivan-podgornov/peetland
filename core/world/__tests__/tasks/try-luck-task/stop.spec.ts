import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TRY_LUCK_PERIOD, TryLuckTask } from '../../../src';
import { createNpcContext, createNpcState } from '../helpers';

describe('TryLuckTask', () => {
  describe('#stop', () => {
    it('Перестаёт бросать шанс', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random, timer });
      const context = createNpcContext();
      task.start(createNpcState(), context);

      task.stop(context);
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).not.toHaveBeenCalled();
    });

    it('Перестаёт бросать шанс только для того актора, который в контексте', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random, timer });
      const firstContext = createNpcContext();
      task.start(createNpcState(), firstContext);
      task.start(createNpcState(), createNpcContext());

      task.stop(firstContext);
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledOnce();
    });

    it("После остановки #update возвращает 'failed'", () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );
      const context = createNpcContext();
      task.start(createNpcState(), context);

      task.stop(context);
      const result = task.update(createNpcState(), context);

      expect(result).toBe('failed');
    });

    it('Если задачу этим актором не начинали, не выбрасывает ошибку', () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );

      expect(() => task.stop(createNpcContext())).not.toThrow();
    });
  });
});
