import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { TryLuckTask } from '../../../src';
import { createNpcState } from '../helpers';

describe('TryLuckTask', () => {
  describe('#applyEffects', () => {
    it('Если эффекты не переданы, возвращает то же состояние', () => {
      const task = new TryLuckTask(
        { chance: 1 / 60 },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );
      const state = createNpcState();

      expect(task.applyEffects(state)).toBe(state);
    });

    it('Возвращает состояние, которое вернули переданные эффекты', () => {
      const effected = createNpcState({ inventory: { bottles: 1 } });
      const task = new TryLuckTask(
        { chance: 1 / 60, applyEffects: () => effected },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );

      expect(task.applyEffects(createNpcState())).toBe(effected);
    });

    it('Применяет переданные эффекты к переданному состоянию', () => {
      const applyEffects = vi.fn((state) => state);
      const task = new TryLuckTask(
        { chance: 1 / 60, applyEffects },
        { random: createMockedRandom(false), timer: new ManualTimer() }
      );
      const state = createNpcState();

      task.applyEffects(state);

      expect(applyEffects).toHaveBeenCalledExactlyOnceWith(state);
    });
  });
});
