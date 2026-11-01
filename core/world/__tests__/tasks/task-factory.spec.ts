import { ParallelTask } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import {
  AchieveAngleTask,
  AddItemTask,
  BuyBoozeTask,
  CollectBottlesTask,
  DrinkTask,
  GoToCoordsTask,
  PlayAnimationTask,
  PurchaseTask,
  RemoveItemTask,
  SellBottlesTask,
  TaskFactory,
  TryLuckTask,
} from '../../src';
import { createMockedPlaces } from '../places/helpers';

import { createTaskFactoryDeps } from './helpers';

describe('TaskFactory', () => {
  describe('#goToCoords', () => {
    it('Возвращает GoToCoordsTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.goToCoords({ coords: { x: 0, y: 0, z: 0 }, completeRadius: 1 });

      expect(task).toBeInstanceOf(GoToCoordsTask);
    });
  });

  describe('#achieveAngle', () => {
    it('Возвращает AchieveAngleTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.achieveAngle({ angle: 0, tolerance: 1 });

      expect(task).toBeInstanceOf(AchieveAngleTask);
    });
  });

  describe('#playAnimation', () => {
    it('Возвращает PlayAnimationTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.playAnimation({ animation: 'pay' });

      expect(task).toBeInstanceOf(PlayAnimationTask);
    });
  });

  describe('#addItem', () => {
    it('Возвращает AddItemTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.addItem({ item: Item.Booze, count: 1 });

      expect(task).toBeInstanceOf(AddItemTask);
    });
  });

  describe('#removeItem', () => {
    it('Возвращает RemoveItemTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.removeItem({ item: Item.Booze, count: 1 });

      expect(task).toBeInstanceOf(RemoveItemTask);
    });
  });

  describe('#tryLuck', () => {
    it('Возвращает TryLuckTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.tryLuck({ chance: 1 / 60 });

      expect(task).toBeInstanceOf(TryLuckTask);
    });
  });

  describe('#parallel', () => {
    it('Возвращает ParallelTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.parallel({
        main: factory.tryLuck({ chance: 1 / 60 }),
        background: factory.playAnimation({ animation: 'trash-search' }),
      });

      expect(task).toBeInstanceOf(ParallelTask);
    });
  });

  describe('#purchase', () => {
    it('Возвращает PurchaseTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.purchase({ item: Item.Booze, count: 1, price: 100 });

      expect(task).toBeInstanceOf(PurchaseTask);
    });
  });

  describe('#buyBooze', () => {
    it('Возвращает BuyBoozeTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.buyBooze({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(BuyBoozeTask);
    });
  });

  describe('#drink', () => {
    it('Возвращает DrinkTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.drink({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(DrinkTask);
    });
  });

  describe('#sellBottles', () => {
    it('Возвращает SellBottlesTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.sellBottles({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(SellBottlesTask);
    });
  });

  describe('#collectBottles', () => {
    it('Возвращает CollectBottlesTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.collectBottles({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(CollectBottlesTask);
    });
  });
});
