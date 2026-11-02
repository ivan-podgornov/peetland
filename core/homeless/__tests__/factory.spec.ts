import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import {
  BegTask,
  BuyBoozeTask,
  CollectBottlesTask,
  DrinkTask,
  PurchaseTask,
  SellBottlesTask,
  HomelessTaskFactory,
} from '../src';

import { createHomelessTaskFactoryDeps } from './helpers';

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
