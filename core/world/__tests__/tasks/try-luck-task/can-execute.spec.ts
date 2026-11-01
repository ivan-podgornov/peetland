import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { TryLuckTask } from '../../../src';
import { createNpcState } from '../helpers';

describe('TryLuckTask', () => {
  describe('#canExecute', () => {
    it('Если условие остановки не передано, возвращает true', () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );

      expect(task.canExecute(createNpcState())).toBe(true);
    });

    it('Если условие остановки не выполнилось, возвращает true', () => {
      const task = new TryLuckTask(
        { chance: 1 / 60, stopWhen: () => false },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );

      expect(task.canExecute(createNpcState())).toBe(true);
    });

    it('Если условие остановки выполнилось, возвращает false', () => {
      const task = new TryLuckTask(
        { chance: 1 / 60, stopWhen: () => true },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );

      expect(task.canExecute(createNpcState())).toBe(false);
    });

    it('Проверяет условие остановки на переданном состоянии', () => {
      const stopWhen = vi.fn(() => false);
      const task = new TryLuckTask(
        { chance: 1 / 60, stopWhen },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );
      const state = createNpcState();

      task.canExecute(state);

      expect(stopWhen).toHaveBeenCalledExactlyOnceWith(state);
    });
  });
});
