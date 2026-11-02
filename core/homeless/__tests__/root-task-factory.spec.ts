import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { HomelessRootTask, HomelessRootTaskFactory } from '../src';

import { createHomelessTaskFactory } from './helpers';

describe('HomelessRootTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр HomelessRootTask', () => {
      const factory = new HomelessRootTaskFactory({
        homelessTaskFactory: createHomelessTaskFactory(),
      });

      const task = factory.create({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(HomelessRootTask);
    });
  });
});
