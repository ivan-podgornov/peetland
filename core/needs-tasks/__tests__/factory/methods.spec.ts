import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { createNeedsTaskFactoryDeps, TEST_SHOP } from '../../dev';
import { NeedsTask, NeedsTaskFactory } from '../../src';
import type { BuyFoodTaskOptions } from '../../src';
import { BuyFoodTask } from '../../src/buy-food-task';
import { SatisfyHungerTask } from '../../src/satisfy-hunger-task';
import { StockFoodTask } from '../../src/stock-food-task';

describe('NeedsTaskFactory', () => {
  describe('#satisfyNeeds', () => {
    it('Возвращает экземпляр NeedsTask', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyNeeds()).toBeInstanceOf(NeedsTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyNeeds()).not.toBe(factory.satisfyNeeds());
    });
  });

  describe('#satisfyHunger', () => {
    it('Возвращает экземпляр SatisfyHungerTask', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyHunger()).toBeInstanceOf(SatisfyHungerTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyHunger()).not.toBe(factory.satisfyHunger());
    });
  });

  describe('#stockFood', () => {
    it('Возвращает экземпляр StockFoodTask', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.stockFood()).toBeInstanceOf(StockFoodTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.stockFood()).not.toBe(factory.stockFood());
    });
  });

  describe('#buyFood', () => {
    it('Возвращает экземпляр BuyFoodTask', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(
        factory.buyFood({
          food: Item.SmilePizza,
          shop: TEST_SHOP,
        })
      ).toBeInstanceOf(BuyFoodTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());
      const options: BuyFoodTaskOptions = {
        food: Item.SmilePizza,
        shop: TEST_SHOP,
      };

      expect(factory.buyFood(options)).not.toBe(factory.buyFood(options));
    });
  });
});
