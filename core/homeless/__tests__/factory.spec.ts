import { describe, expect, it } from 'vitest';

import { createHomelessTaskFactoryDeps } from '../dev';
import { BegTask } from '../src/beg-task';
import { CollectBottlesTask } from '../src/collect-bottles-task';
import { HomelessTaskFactory } from '../src/factory';
import { SellBottlesTask } from '../src/sell-bottles-task';

describe('HomelessTaskFactory', () => {
  describe('#sellBottles', () => {
    it('Возвращает SellBottlesTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.sellBottles();

      expect(task).toBeInstanceOf(SellBottlesTask);
    });
  });

  describe('#collectBottles', () => {
    it('Возвращает CollectBottlesTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.collectBottles();

      expect(task).toBeInstanceOf(CollectBottlesTask);
    });
  });

  describe('#beg', () => {
    it('Возвращает BegTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.beg();

      expect(task).toBeInstanceOf(BegTask);
    });
  });
});
