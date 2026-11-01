import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { TRY_LUCK_PERIOD, TryLuckTask } from '../../../src';
import { createNpcContext, createNpcState } from '../helpers';

describe('TryLuckTask', () => {
  describe('#start', () => {
    it("Возвращает 'running'", () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('running');
    });

    it('Раз в TRY_LUCK_PERIOD бросает шанс с переданной вероятностью', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random, timer });

      task.start(createNpcState(), createNpcContext());
      timer.advance(TRY_LUCK_PERIOD * 2);

      expect(random.chance.mock.calls).toStrictEqual([[1 / 60], [1 / 60]]);
    });

    it('Не бросает шанс, пока не прошёл TRY_LUCK_PERIOD', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random, timer });

      task.start(createNpcState(), createNpcContext());
      timer.advance(TRY_LUCK_PERIOD - 1);

      expect(random.chance).not.toHaveBeenCalled();
    });

    it('Если повезло, больше не бросает шанс', () => {
      const random = createMockedRandom(true);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random, timer });

      task.start(createNpcState(), createNpcContext());
      timer.advance(TRY_LUCK_PERIOD * 3);

      expect(random.chance).toHaveBeenCalledOnce();
    });

    it('При каждой попытке вызывает onAttempt с контекстом', () => {
      const onAttempt = vi.fn();
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60, onAttempt },
        { random: createMockedRandom(false), timer }
      );
      const context = createNpcContext();

      task.start(createNpcState(), context);
      timer.advance(TRY_LUCK_PERIOD * 2);

      expect(onAttempt.mock.calls).toStrictEqual([[context], [context]]);
    });

    it('Вызывает onAttempt до броска шанса', () => {
      const onAttempt = vi.fn();
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60, onAttempt }, { random, timer });

      task.start(createNpcState(), createNpcContext());
      timer.advance(TRY_LUCK_PERIOD);

      expect(onAttempt).toHaveBeenCalledBefore(random.chance);
    });

    it('Если повезло, вызывает onAttempt', () => {
      const onAttempt = vi.fn();
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        { chance: 1 / 60, onAttempt },
        { random: createMockedRandom(true), timer }
      );

      task.start(createNpcState(), createNpcContext());
      timer.advance(TRY_LUCK_PERIOD);

      expect(onAttempt).toHaveBeenCalledOnce();
    });

    it('Если задачу этим актором уже начали, прекращает прежние попытки', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask({ chance: 1 / 60 }, { random, timer });
      const context = createNpcContext();
      task.start(createNpcState(), context);

      task.start(createNpcState(), context);
      timer.advance(TRY_LUCK_PERIOD);

      expect(random.chance).toHaveBeenCalledOnce();
    });
  });
});
