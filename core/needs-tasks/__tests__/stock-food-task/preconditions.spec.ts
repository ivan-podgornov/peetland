import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { TEST_CAMP, TEST_SHOP, createPlaces } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { createMockedFoodChooser, createStockFoodTask } from '../../dev';

describe('StockFoodTask', () => {
  describe('Метод buy-food', () => {
    describe('Предусловия', () => {
      it('Если еды в инвентаре нет, а IFoodChooser выбрал, что купить, план составляется', () => {
        const task = createStockFoodTask({
          foodChooser: createMockedFoodChooser({
            fromInventory: null,
            toBuy: Item.RomashkaLoaf,
          }),
        });

        expect(planSteps(task, NpcStateBuilder.default())).not.toBeNull();
      });

      it('Если еда в инвентаре уже есть, план не составляется', () => {
        const task = createStockFoodTask({
          foodChooser: createMockedFoodChooser({
            fromInventory: Item.RomashkaLoaf,
            toBuy: Item.RomashkaLoaf,
          }),
        });

        expect(planSteps(task, NpcStateBuilder.default())).toBeNull();
      });

      it('Если IFoodChooser не нашёл еды, на которую хватает денег, план не составляется', () => {
        const task = createStockFoodTask({
          foodChooser: createMockedFoodChooser({
            fromInventory: null,
            toBuy: null,
          }),
        });

        expect(planSteps(task, NpcStateBuilder.default())).toBeNull();
      });

      it('Если магазинов нет, план не составляется', () => {
        const task = createStockFoodTask({
          foodChooser: createMockedFoodChooser({ toBuy: Item.RomashkaLoaf }),
          places: createPlaces([TEST_CAMP]),
        });

        expect(planSteps(task, NpcStateBuilder.default())).toBeNull();
      });

      it('Если бомжарен нет, план составляется: есть сразу не нужно', () => {
        const task = createStockFoodTask({
          foodChooser: createMockedFoodChooser({ toBuy: Item.RomashkaLoaf }),
          places: createPlaces([TEST_SHOP]),
        });

        expect(planSteps(task, NpcStateBuilder.default())).not.toBeNull();
      });
    });
  });
});
