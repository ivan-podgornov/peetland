import { describe, expect, it } from 'vitest';

import { HobbiesTaskFactory } from '../src/hobbies-task-factory';

describe('HobbiesTaskFactory', () => {
  describe('#create', () => {
    it('Пока хобби нет, возвращает составную задачу без методов', () => {
      const factory = new HobbiesTaskFactory();

      const task = factory.create();

      expect(task).toStrictEqual({
        name: 'hobbies',
        methods: [],
      });
    });
  });
});
