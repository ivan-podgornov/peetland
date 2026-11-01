import { Geometry } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import {
  AchieveAngleTask,
  AddItemTask,
  BuyBoozeTask,
  DrinkTask,
  GoToCoordsTask,
  PlayAnimationTask,
  PurchaseTask,
  RemoveItemTask,
  TaskFactory,
} from '../../src';
import { createMockedPlaces } from '../places/helpers';

describe('TaskFactory', () => {
  describe('#goToCoords', () => {
    it('Возвращает GoToCoordsTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.goToCoords({ coords: { x: 0, y: 0, z: 0 }, completeRadius: 1 });

      expect(task).toBeInstanceOf(GoToCoordsTask);
    });
  });

  describe('#achieveAngle', () => {
    it('Возвращает AchieveAngleTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.achieveAngle({ angle: 0, tolerance: 1 });

      expect(task).toBeInstanceOf(AchieveAngleTask);
    });
  });

  describe('#playAnimation', () => {
    it('Возвращает PlayAnimationTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.playAnimation({ animation: 'pay' });

      expect(task).toBeInstanceOf(PlayAnimationTask);
    });
  });

  describe('#addItem', () => {
    it('Возвращает AddItemTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.addItem({ item: Item.Booze, count: 1 });

      expect(task).toBeInstanceOf(AddItemTask);
    });
  });

  describe('#removeItem', () => {
    it('Возвращает RemoveItemTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.removeItem({ item: Item.Booze, count: 1 });

      expect(task).toBeInstanceOf(RemoveItemTask);
    });
  });

  describe('#purchase', () => {
    it('Возвращает PurchaseTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.purchase({ item: Item.Booze, count: 1, price: 100 });

      expect(task).toBeInstanceOf(PurchaseTask);
    });
  });

  describe('#buyBooze', () => {
    it('Возвращает BuyBoozeTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.buyBooze({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(BuyBoozeTask);
    });
  });

  describe('#drink', () => {
    it('Возвращает DrinkTask', () => {
      const factory = new TaskFactory({ geometry: new Geometry() });

      const task = factory.drink({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(DrinkTask);
    });
  });
});
