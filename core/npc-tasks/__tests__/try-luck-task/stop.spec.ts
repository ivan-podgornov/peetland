import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TryLuckTask } from '../../src/try-luck-task';

describe('TryLuckTask', () => {
  describe('#stop', () => {
    it('Перестаёт бросать шанс', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random,
          timer,
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      task.stop();
      timer.advance(TryLuckTask.PERIOD);

      expect(random.chance).not.toHaveBeenCalled();
    });

    it("После остановки #update возвращает 'failed'", () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random: createMockedRandom(false),
          timer: new ManualTimer(),
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      task.stop();
      const result = task.update(NpcStateBuilder.default());

      expect(result).toBe('failed');
    });

    it('Если задачу не начинали, не выбрасывает ошибку', () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random: createMockedRandom(false),
          timer: new ManualTimer(),
        }
      );

      expect(() => task.stop()).not.toThrow();
    });
  });
});
