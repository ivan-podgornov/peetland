import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createPlaces } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { createSatisfyHungerTask, TEST_CAMP, TEST_SHOP } from '../../../dev';
import { FOOD_PRICES } from '../../../src/constants';

describe('SatisfyHungerTask', () => {
  describe('Метод buy-food', () => {
    describe('Предусловия', () => {
      it('Если денег хватает на самую дешёвую еду, план составляется', () => {
        const task = createSatisfyHungerTask();
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: FOOD_PRICES[Item.RomashkaLoaf] })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если денег не хватает ни на какую еду, план не составляется', () => {
        const task = createSatisfyHungerTask();
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: FOOD_PRICES[Item.RomashkaLoaf] - 1 })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Если магазинов нет, план не составляется', () => {
        const task = createSatisfyHungerTask({ places: createPlaces([TEST_CAMP]) });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: 1000 })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Если бомжарен нет, план не составляется: есть негде', () => {
        const task = createSatisfyHungerTask({ places: createPlaces([TEST_SHOP]) });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: 1000 })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        expect(planSteps(task, state)).toBeNull();
      });
    });
  });
});
