import { describe, expect, it, vi } from 'vitest';

import { ParallelTask } from '../../src';
import { testState } from '../helpers';

import { createContext, createMockedPrimitive } from './helpers';

describe('ParallelTask', () => {
  describe('#stop', () => {
    it('Останавливает основную задачу', () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({ main, background: createMockedPrimitive() });
      const context = createContext();
      task.start(testState, context);

      task.stop(context);

      expect(main.stop).toHaveBeenCalledExactlyOnceWith(context);
    });

    it('Если фоновая задача выполняется, останавливает её', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({ main: createMockedPrimitive(), background });
      const context = createContext();
      task.start(testState, context);

      task.stop(context);

      expect(background.stop).toHaveBeenCalledExactlyOnceWith(context);
    });

    it('Если фоновая задача не выполняется, её не останавливает', () => {
      const background = createMockedPrimitive({ start: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({ main: createMockedPrimitive(), background });
      const context = createContext();
      task.start(testState, context);

      task.stop(context);

      expect(background.stop).not.toHaveBeenCalled();
    });

    it("После остановки #update возвращает 'failed'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive(),
      });
      const context = createContext();
      task.start(testState, context);

      task.stop(context);

      expect(task.update(testState, context)).toBe('failed');
    });

    it('Если задачу в этом контексте не начинали, ничего не останавливает', () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({ main, background: createMockedPrimitive() });

      task.stop(createContext());

      expect(main.stop).not.toHaveBeenCalled();
    });
  });
});
