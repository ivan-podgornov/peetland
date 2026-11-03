import { describe, expect, it, vi } from 'vitest';

import { testState, createContext, createMockedPrimitive } from '../../../dev';
import { ParallelTask } from '../../../src';

describe('ParallelTask', () => {
  describe('#update', () => {
    it('Обновляет основную задачу с состоянием и контекстом', () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({
        main,
        background: createMockedPrimitive(),
      });
      const context = createContext();
      task.start(testState, context);

      task.update(testState, context);

      expect(main.update).toHaveBeenCalledExactlyOnceWith(testState, context);
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

    it("После того как основная задача завершилась, возвращает 'failed'", () => {
      const main = createMockedPrimitive({ update: vi.fn(() => 'success' as const) });
      const task = new ParallelTask({
        main,
        background: createMockedPrimitive(),
      });
      const context = createContext();
      task.start(testState, context);
      task.update(testState, context);

      expect(task.update(testState, context)).toBe('failed');
    });
  });
});
