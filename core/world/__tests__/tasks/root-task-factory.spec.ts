import { describe, expect, it } from 'vitest';

import { RootTask, RootTaskFactory } from '../../src';

import { createTaskFactory } from './helpers';

describe('RootTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр RootTask', () => {
      const factory = new RootTaskFactory({ taskFactory: createTaskFactory() });

      const task = factory.create({ places: [] });

      expect(task).toBeInstanceOf(RootTask);
    });
  });
});
