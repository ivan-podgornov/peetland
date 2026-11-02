import { Item } from '@peetland/inventory';
import { createMockedPlaces } from '@peetland/places/dev';
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

      const task = factory.buyBooze({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(BuyBoozeTask);
    });
  });

  describe('#drink', () => {
    it('Возвращает DrinkTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.drink({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(DrinkTask);
    });
  });

  describe('#sellBottles', () => {
    it('Возвращает SellBottlesTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.sellBottles({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(SellBottlesTask);
    });
  });

  describe('#collectBottles', () => {
    it('Возвращает CollectBottlesTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.collectBottles({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(CollectBottlesTask);
    });
  });

  describe('#beg', () => {
    it('Возвращает BegTask', () => {
      const factory = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

      const task = factory.beg({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(BegTask);
    });
  });
});
