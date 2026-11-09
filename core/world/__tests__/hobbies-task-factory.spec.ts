import { describe, expect, it } from 'vitest';

import { HobbiesTask } from '../src/hobbies-task';
import { HobbiesTaskFactory } from '../src/hobbies-task-factory';

describe('HobbiesTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр HobbiesTask', () => {
      const factory = new HobbiesTaskFactory();

      const task = factory.create();

      expect(task).toBeInstanceOf(HobbiesTask);
    });
  });
});
