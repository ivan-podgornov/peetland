import { describe, expect, it } from 'vitest';

import { NeedsTaskFactory } from '../src/needs-task-factory';

describe('NeedsTaskFactory', () => {
  describe('#create', () => {
    it('Пока потребностей нет, возвращает составную задачу без методов', () => {
      const factory = new NeedsTaskFactory();

      const task = factory.create();

      expect(task).toStrictEqual({
        name: 'needs',
        methods: [],
      });
    });
  });
});
