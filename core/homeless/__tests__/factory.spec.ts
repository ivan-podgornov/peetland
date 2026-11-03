import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { createHomelessTaskFactoryDeps } from '../dev';
import { BegTask } from '../src/beg-task';
import { BuyBoozeTask } from '../src/buy-booze-task';
import { CollectBottlesTask } from '../src/collect-bottles-task';
import { DrinkTask } from '../src/drink-task';
import { HomelessTaskFactory } from '../src/factory';
import { PurchaseTask } from '../src/purchase-task';
import { SellBottlesTask } from '../src/sell-bottles-task';

describe('HomelessTaskFactory', () => {
  describe('#purchase', () => {
    it('Возвращает PurchaseTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.purchase({
        item: Item.Booze,
        count: 1,
        price: 100,
      });

      expect(task).toBeInstanceOf(PurchaseTask);
    });
  });

  describe('#buyBooze', () => {
    it('Возвращает BuyBoozeTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.buyBooze();

      expect(task).toBeInstanceOf(BuyBoozeTask);
    });
  });

  describe('#drink', () => {
    it('Возвращает DrinkTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.drink();

      expect(task).toBeInstanceOf(DrinkTask);
    });
  });

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
