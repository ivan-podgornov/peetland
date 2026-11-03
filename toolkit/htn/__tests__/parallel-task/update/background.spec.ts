import { describe, expect, it, vi } from 'vitest';

import { testState, createContext, createMockedPrimitive } from '../../../dev';
import { ParallelTask } from '../../../src';

describe('ParallelTask', () => {
  describe('#update', () => {
    it('Если обе задачи выполняются, обновляет фоновую задачу с состоянием и контекстом', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background,
      });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(background.update).toHaveBeenCalledExactlyOnceWith(testState, context);
    });

    it('Если фоновая задача завершилась успешно, запускает её заново в следующем update', () => {
      const background = createMockedPrimitive({ update: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background,
      });
      const context = createContext();
      task.start(testState, context);
      task.update(testState, context);

      task.update(testState, context);

      expect(background.start).toHaveBeenCalledTimes(2);
    });

    it("Если фоновая задача завершилась успешно, возвращает 'running'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive({ update: vi.fn(() => 'success' as const) }),
      });
      const context = createContext();
      task.start(testState, context);

      expect(task.update(testState, context)).toBe('running');
    });

    it("Если фоновую задачу нельзя запустить заново, возвращает 'failed'", () => {
      const background = createMockedPrimitive({ start: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background,
      });
      const context = createContext();
      task.start(testState, context);
      background.canExecute.mockReturnValue(false);

      expect(task.update(testState, context)).toBe('failed');
    });

    it("Если фоновая задача вернула 'failed', возвращает 'failed'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive({ update: vi.fn(() => 'failed' as const) }),
      });
      const context = createContext();
      task.start(testState, context);

      expect(task.update(testState, context)).toBe('failed');
    });

    it("Если фоновая задача вернула 'failed', останавливает основную", () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({
        main,
        background: createMockedPrimitive({ update: vi.fn(() => 'failed' as const) }),
      });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(main.stop).toHaveBeenCalledExactlyOnceWith(context);
    });

    it("Если задачу в этом контексте не начинали, возвращает 'failed'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive(),
      });

      expect(task.update(testState, createContext())).toBe('failed');
    });

    it('Обновляет фоновую задачу только того контекста, в котором её начали заново', () => {
      const background = createMockedPrimitive({ start: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background,
      });
      const firstContext = createContext();
      const secondContext = createContext();
      task.start(testState, firstContext);
      task.start(testState, secondContext);
      background.start.mockReturnValue('running');
      task.update(testState, firstContext);

      task.update(testState, secondContext);

      expect(background.start).toHaveBeenLastCalledWith(testState, secondContext);
    });
  });
});
