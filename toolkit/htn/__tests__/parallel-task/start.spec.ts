import { describe, expect, it, vi } from 'vitest';

import { ParallelTask } from '../../src';
import { testState } from '../helpers';

import { createContext, createMockedPrimitive } from './helpers';

describe('ParallelTask', () => {
  describe('#start', () => {
    it('Начинает основную задачу с состоянием и контекстом', () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({ main, background: createMockedPrimitive() });
      const context = createContext();

      task.start(testState, context);

      expect(main.start).toHaveBeenCalledExactlyOnceWith(testState, context);
    });

    it('Начинает фоновую задачу с состоянием и контекстом', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({ main: createMockedPrimitive(), background });
      const context = createContext();

      task.start(testState, context);

      expect(background.start).toHaveBeenCalledExactlyOnceWith(testState, context);
    });

    it("Если обе задачи выполняются, возвращает 'running'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive(),
      });

      expect(task.start(testState, createContext())).toBe('running');
    });

    it.each(['success', 'failed'] as const)(
      "Если основная задача сразу вернула '%s', возвращает его",
      (result) => {
        const task = new ParallelTask({
          main: createMockedPrimitive({ start: vi.fn(() => result) }),
          background: createMockedPrimitive(),
        });

        expect(task.start(testState, createContext())).toBe(result);
      }
    );

    it('Если основная задача завершилась сразу, фоновую не начинает', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({
        main: createMockedPrimitive({ start: vi.fn(() => 'success' as const) }),
        background,
      });

      task.start(testState, createContext());

      expect(background.start).not.toHaveBeenCalled();
    });

    it("Если фоновая задача сразу вернула 'success', возвращает 'running'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive({ start: vi.fn(() => 'success' as const) }),
      });

      expect(task.start(testState, createContext())).toBe('running');
    });

    it("Если фоновая задача сразу вернула 'failed', возвращает 'failed'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive({ start: vi.fn(() => 'failed' as const) }),
      });

      expect(task.start(testState, createContext())).toBe('failed');
    });

    it("Если фоновая задача сразу вернула 'failed', останавливает основную", () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({
        main,
        background: createMockedPrimitive({ start: vi.fn(() => 'failed' as const) }),
      });
      const context = createContext();

      task.start(testState, context);

      expect(main.stop).toHaveBeenCalledExactlyOnceWith(context);
    });
  });
});
