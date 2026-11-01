import { Geometry } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { RootTask, RootTaskFactory } from '../../src';

import { createTaskFactory } from './helpers';

describe('RootTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр RootTask', () => {
      const factory = new RootTaskFactory({
        geometry: new Geometry(),
        taskFactory: createTaskFactory(),
      });

      const task = factory.create({ places: [] });

      expect(task).toBeInstanceOf(RootTask);
    });
  });
});
