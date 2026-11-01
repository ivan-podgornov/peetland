import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TRY_LUCK_PERIOD, TryLuckTask } from '../../../src';
import { createNpcContext, createNpcState } from '../helpers';

describe('TryLuckTask', () => {
  describe('#update', () => {
    it("Если не повезло, возвращает 'running'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        { random: createMockedRandom(false), timer }
      );
      const context = createNpcContext();
      task.start(createNpcState(), context);

      timer.advance(TRY_LUCK_PERIOD);
      const result = task.update(createNpcState(), context);

      expect(result).toBe('running');
    });

    it("Если повезло, возвращает 'success'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random: createMockedRandom(true), timer });
      const context = createNpcContext();
      task.start(createNpcState(), context);

      timer.advance(TRY_LUCK_PERIOD);
      const result = task.update(createNpcState(), context);

      expect(result).toBe('success');
    });

    it("Если не повезло, а условие остановки выполнилось, возвращает 'failed'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60, stopWhen: (state) => state.feelings.shame >= 80 },
        { random: createMockedRandom(false), timer }
      );
      const context = createNpcContext();
      task.start(createNpcState(), context);

      timer.advance(TRY_LUCK_PERIOD);
      const result = task.update(createNpcState({ feelings: { shame: 80 } }), context);

      expect(result).toBe('failed');
    });

    it('Если выполнилось условие остановки, больше не бросает шанс', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60, stopWhen: () => true }, { random, timer });
      const context = createNpcContext();
      task.start(createNpcState(), context);

      task.update(createNpcState(), context);
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).not.toHaveBeenCalled();
    });

    it("Если повезло, а условие остановки выполнилось, возвращает 'success'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60, stopWhen: () => true },
        { random: createMockedRandom(true), timer }
      );
      const context = createNpcContext();
      task.start(createNpcState(), context);

      timer.advance(TRY_LUCK_PERIOD);
      const result = task.update(createNpcState(), context);

      expect(result).toBe('success');
    });

    it("Если задачу этим актором не начинали, возвращает 'failed'", () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        { random: createMockedRandom(true), timer: new ManualTimer() }
      );

      const result = task.update(createNpcState(), createNpcContext());

      expect(result).toBe('failed');
    });

    it('Возвращает результат попыток того актора, который в контексте', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random, timer });
      const firstContext = createNpcContext();
      const secondContext = createNpcContext();
      task.start(createNpcState(), firstContext);
      task.start(createNpcState(), secondContext);

      random.chance.mockReturnValueOnce(true);
      timer.advance(TRY_LUCK_PERIOD);
      const result = task.update(createNpcState(), secondContext);

      expect(result).toBe('running');
    });

    it("После того как вернула 'success', возвращает 'failed'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random: createMockedRandom(true), timer });
      const context = createNpcContext();
      task.start(createNpcState(), context);
      timer.advance(TRY_LUCK_PERIOD);
      task.update(createNpcState(), context);

      const result = task.update(createNpcState(), context);

      expect(result).toBe('failed');
    });
  });
});
