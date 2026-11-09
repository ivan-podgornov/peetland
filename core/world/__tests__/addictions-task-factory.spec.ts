import { describe, expect, it } from 'vitest';

import { AddictionsTaskFactory } from '../src/addictions-task-factory';

describe('AddictionsTaskFactory', () => {
  describe('#create', () => {
    it('Пока зависимостей нет, возвращает составную задачу без методов', () => {
      const factory = new AddictionsTaskFactory();

      const task = factory.create();

      expect(task).toStrictEqual({
        name: 'addictions',
        methods: [],
      });
    });
  });
});
