import { describe, expect, it } from 'vitest';

import { createMockedPrimitive } from '../../dev';
import { ParallelTask } from '../../src';

describe('ParallelTask', () => {
  describe('Состав', () => {
    it('main возвращает основную задачу', () => {
      const main = createMockedPrimitive();
      const task = new ParallelTask({
        main,
        background: createMockedPrimitive(),
      });

      expect(task.main).toBe(main);
    });

    it('background возвращает фоновую задачу', () => {
      const background = createMockedPrimitive();
      const task = new ParallelTask({
        main: createMockedPrimitive(),
        background,
      });

      expect(task.background).toBe(background);
    });
  });
});
