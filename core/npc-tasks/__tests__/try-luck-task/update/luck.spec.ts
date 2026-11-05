import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TryLuckTask } from '../../../src/try-luck-task';

describe('TryLuckTask', () => {
  describe('#update', () => {
    it("Если не повезло, возвращает 'running'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random: createMockedRandom(false),
          timer,
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      timer.advance(TryLuckTask.PERIOD);
      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('running');
    });

    it("Если повезло, возвращает 'success'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random: createMockedRandom(true),
          timer,
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      timer.advance(TryLuckTask.PERIOD);
      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('success');
    });

    it("Если задачу этим актором не начинали, возвращает 'failed'", () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random: createMockedRandom(true),
          timer: new ManualTimer(),
        }
      );

      const result = task.update(NpcStateBuilder.default(), createNpcContext());

      expect(result).toBe('failed');
    });

    it('Возвращает результат попыток того актора, который в контексте', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random,
          timer,
        }
      );
      const firstContext = createNpcContext();
      const secondContext = createNpcContext();
      task.start(NpcStateBuilder.default(), firstContext);
      task.start(NpcStateBuilder.default(), secondContext);

      random.chance.mockReturnValueOnce(true);
      timer.advance(TryLuckTask.PERIOD);
      const result = task.update(NpcStateBuilder.default(), secondContext);

      expect(result).toBe('running');
    });

    it("После того как вернула 'success', возвращает 'failed'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        {
          random: createMockedRandom(true),
          timer,
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);
      timer.advance(TryLuckTask.PERIOD);
      task.update(NpcStateBuilder.default(), context);

      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('failed');
    });
  });
});
