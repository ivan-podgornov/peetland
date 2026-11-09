import { describe, expect, it } from 'vitest';

import { NeedsTask } from '../src/needs-task';
import { NeedsTaskFactory } from '../src/needs-task-factory';

describe('NeedsTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр NeedsTask', () => {
      const factory = new NeedsTaskFactory();

      const task = factory.create();

      expect(task).toBeInstanceOf(NeedsTask);
    });
  });
});
