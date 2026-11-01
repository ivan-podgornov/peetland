import { describe, expect, it, vi } from 'vitest';

import { ParallelTask } from '../../src';
import { testState } from '../helpers';

import { createMockedPrimitive } from './helpers';

describe('ParallelTask', () => {
  describe('#applyEffects', () => {
    it('Возвращает состояние с эффектами основной задачи', () => {
      const task = new ParallelTask({
        main: createMockedPrimitive({
          applyEffects: vi.fn((state) => ({ ...state, counter: state.counter + 1 })),
        }),
        background: createMockedPrimitive(),
      });

      expect(task.applyEffects({ ...testState, counter: 0 }).counter).toBe(1);
    });

    it('Не применяет эффекты фоновой задачи', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({ main: createMockedPrimitive(), background });

      task.applyEffects(testState);

      expect(background.applyEffects).not.toHaveBeenCalled();
    });
  });
});
