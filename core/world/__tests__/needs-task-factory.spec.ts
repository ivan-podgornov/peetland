import { createStubTask } from '@peetland/htn/dev';
import { SatisfyNeedsTask } from '@peetland/needs-tasks';
import { createMockedSatisfyNeedsTaskFactory } from '@peetland/needs-tasks/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { describe, expect, it } from 'vitest';

import { NeedsTaskFactory } from '../src/needs-task-factory';

describe('NeedsTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает задачу, которую вернул satisfyNeedsTaskFactory.satisfyNeeds', () => {
      const satisfyNeeds = createStubTask<NpcState, NpcContext>('satisfy-needs');
      const factory = new NeedsTaskFactory({
        satisfyNeedsTaskFactory: createMockedSatisfyNeedsTaskFactory({
          satisfyNeeds: () => satisfyNeeds,
        }),
      });

      expect(factory.create()).toBe(satisfyNeeds);
    });

    it('Если satisfyNeedsTaskFactory не передана, возвращает экземпляр SatisfyNeedsTask', () => {
      const factory = new NeedsTaskFactory();

      expect(factory.create()).toBeInstanceOf(SatisfyNeedsTask);
    });
  });
});
