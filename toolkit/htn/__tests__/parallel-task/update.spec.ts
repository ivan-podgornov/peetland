import { describe, expect, it, vi } from 'vitest';

import { ParallelTask } from '../../src';
import { testState } from '../helpers';

import { createContext, createMockedPrimitive } from './helpers';

describe('ParallelTask', () => {
  describe('#update', () => {
    it('Обновляет основную задачу с состоянием и контекстом', () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({ main, background: createMockedPrimitive() });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(main.update).toHaveBeenCalledExactlyOnceWith(testState, context);
    });

    it('Если обе задачи выполняются, обновляет фоновую задачу с состоянием и контекстом', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({ main: createMockedPrimitive(), background });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(background.update).toHaveBeenCalledExactlyOnceWith(testState, context);
    });

    it("Если обе задачи выполняются, возвращает 'running'", () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive(),
      });
      const context = createContext();
      task.start(testState, context);

      expect(task.update(testState, context)).toBe('running');
    });

    it.each(['success', 'failed'] as const)(
      "Если основная задача вернула '%s', возвращает его",
      (result) => {
        const task = new ParallelTask({
          main: createMockedPrimitive({ update: vi.fn(() => result) }),
          background: createMockedPrimitive(),
        });
        const context = createContext();
        task.start(testState, context);

        expect(task.update(testState, context)).toBe(result);
      }
    );

    it('Если основная задача завершилась, останавливает фоновую', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({
        main: createMockedPrimitive({ update: vi.fn(() => 'success' as const) }),
        background,
      });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(background.stop).toHaveBeenCalledExactlyOnceWith(context);
    });

    it('Если основная задача завершилась, фоновую не обновляет', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({
        main: createMockedPrimitive({ update: vi.fn(() => 'success' as const) }),
        background,
      });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(background.update).not.toHaveBeenCalled();
    });

    it('Если основная задача завершилась, когда фоновая не выполнялась, фоновую не останавливает', () => {
      const background = createMockedPrimitive({ start: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({
        main: createMockedPrimitive({ update: vi.fn(() => 'success' as const) }),
        background,
      });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(background.stop).not.toHaveBeenCalled();
    });

    it('Если фоновая задача завершилась успешно, запускает её заново в следующем update', () => {
      const background = createMockedPrimitive({ update: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({ main: createMockedPrimitive(), background });
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
      const task = new ParallelTask({ main: createMockedPrimitive(), background });
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
      const task = new ParallelTask({ main: createMockedPrimitive(), background });
      const firstContext = createContext();
      const secondContext = createContext();
      task.start(testState, firstContext);
      task.start(testState, secondContext);
      background.start.mockReturnValue('running');
      task.update(testState, firstContext);

      task.update(testState, secondContext);

      expect(background.start).toHaveBeenLastCalledWith(testState, secondContext);
    });

    it("После того как основная задача завершилась, возвращает 'failed'", () => {
      const main = createMockedPrimitive({ update: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({ main, background: createMockedPrimitive() });
      const context = createContext();
      task.start(testState, context);
      task.update(testState, context);

      expect(task.update(testState, context)).toBe('failed');
    });
  });
});
