import { describe, expect, it } from 'vitest';

import { RootTask, RootTaskFactory } from '../../src';
import { createMockedPlaces } from '../places/helpers';

import { createTaskFactory } from './helpers';

describe('RootTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр RootTask', () => {
      const factory = new RootTaskFactory({ taskFactory: createTaskFactory() });

      const task = factory.create({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(RootTask);
    });
  });
});
