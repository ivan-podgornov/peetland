import { describe, expect, it, vi } from 'vitest';

import { ParallelTask } from '../../src';
import { testState } from '../helpers';

import { createMockedPrimitive } from './helpers';

describe('ParallelTask', () => {
  describe('#canExecute', () => {
    it('Если обе задачи можно выполнить, возвращает true', () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive(),
      });

      expect(task.canExecute(testState)).toBe(true);
    });

    it('Если основную задачу выполнить нельзя, возвращает false', () => {
      const task = new ParallelTask({
        main: createMockedPrimitive({ canExecute: vi.fn(() => false) }),
        background: createMockedPrimitive(),
      });

      expect(task.canExecute(testState)).toBe(false);
    });

    it('Если фоновую задачу выполнить нельзя, возвращает false', () => {
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background: createMockedPrimitive({ canExecute: vi.fn(() => false) }),
      });

      expect(task.canExecute(testState)).toBe(false);
    });
  });
});
