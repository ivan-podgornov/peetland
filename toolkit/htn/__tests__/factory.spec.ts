import { describe, expect, it, vi } from 'vitest';

import { HTNFactory } from '../src';
import type { PrimitiveTask } from '../src';

describe('HTNFactory', () => {
  describe('#create', () => {
    it('Создаёт HTN-агента, который исполняет переданную корневую задачу', () => {
      const root: PrimitiveTask<null> = {
        name: 'root',
        canExecute: () => true,
        applyEffects: (state) => state,
        start: vi.fn(() => 'running' as const),
        update: () => 'running',
        stop: () => undefined,
      };
      const htn = new HTNFactory<null>().create(root);

      htn.update(null);

      expect(root.start).toHaveBeenCalledExactlyOnceWith(null);
    });
  });
});
