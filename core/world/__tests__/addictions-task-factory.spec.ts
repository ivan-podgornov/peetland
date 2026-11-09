import { describe, expect, it } from 'vitest';

import { AddictionsTask } from '../src/addictions-task';
import { AddictionsTaskFactory } from '../src/addictions-task-factory';

describe('AddictionsTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр AddictionsTask', () => {
      const factory = new AddictionsTaskFactory();

      const task = factory.create();

      expect(task).toBeInstanceOf(AddictionsTask);
    });
  });
});
