import { planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import {
  createMockedFoodChooser,
  createMockedNeedsTaskFactory,
  createStockFoodTask,
  TEST_SHOP,
} from '../../dev';
import { EATING_SATIETY } from '../../src/constants';

describe('StockFoodTask', () => {
  describe('Метод buy-food', () => {
    describe('Задачи', () => {
      it('Планирует только купить еду, но не есть', () => {
        const task = createStockFoodTask({
          foodChooser: createMockedFoodChooser({ toBuy: Item.RomashkaLoaf }),
        });

        expect(planTree(planSteps(task, NpcStateBuilder.default()) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('stock-food', 'buy-food', (stock) => stock.primitive('buy-food'))
            .build()
        );
      });

      it('Выбирает, что купить, на сытость, при которой съест еду', () => {
        const foodChooser = createMockedFoodChooser({ toBuy: Item.RomashkaLoaf });
        const task = createStockFoodTask({ foodChooser });
        const state = NpcStateBuilder.default();

        planSteps(task, state);

        expect(foodChooser.chooseToBuy).toHaveBeenCalledWith(state, EATING_SATIETY);
      });

      it('Покупает выбранную еду в ближайшем магазине', () => {
        const needsTaskFactory = createMockedNeedsTaskFactory();
        const task = createStockFoodTask({
          needsTaskFactory,
          foodChooser: createMockedFoodChooser({ toBuy: Item.RomashkaLoaf }),
        });

        planSteps(task, NpcStateBuilder.default());

        expect(needsTaskFactory.buyFood).toHaveBeenCalledExactlyOnceWith({
          food: Item.RomashkaLoaf,
          shop: TEST_SHOP,
        });
      });
    });
  });
});
