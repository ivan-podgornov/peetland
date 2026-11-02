import type { Task } from '@peetland/htn';
import { describe, expect, it, vi } from 'vitest';

import { NpcKind, RootTaskFactory } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('RootTaskFactory', () => {
  describe('#create', () => {
    it('Вызывает create у фабрики переданного типа', () => {
      const homelessFactory = {
        create: vi.fn(() => ({
          name: 'root',
          methods: [],
        })),
      };
      const factory = new RootTaskFactory({
        kindFactories: { [NpcKind.Homeless]: homelessFactory },
      });

      factory.create(NpcKind.Homeless);

      expect(homelessFactory.create).toHaveBeenCalledExactlyOnceWith();
    });

    it('Возвращает задачу, которую вернула фабрика переданного типа', () => {
      const rootTask: Task<NpcState, NpcContext> = {
        name: 'root',
        methods: [],
      };
      const factory = new RootTaskFactory({
        kindFactories: { [NpcKind.Homeless]: { create: () => rootTask } },
      });

      const task = factory.create(NpcKind.Homeless);

      expect(task).toBe(rootTask);
    });
  });
});
