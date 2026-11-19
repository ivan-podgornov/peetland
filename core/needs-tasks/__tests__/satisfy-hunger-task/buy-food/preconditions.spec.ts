import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { TEST_MEAL_SPOT, TEST_SHOP, createPlaces } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { createMockedFoodChooser, createSatisfyHungerTask } from '../../../dev';

describe('SatisfyHungerTask', () => {
  describe('Метод buy-food', () => {
    describe('Предусловия', () => {
      it('Если IFoodChooser выбрал, что купить, план составляется', () => {
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({ eat: () => createStubTask('eat') }),
          foodChooser: createMockedFoodChooser({ toBuy: Item.RomashkaLoaf }),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если IFoodChooser не нашёл еды, на которую хватает денег, план не составляется', () => {
        const task = createSatisfyHungerTask({
          foodChooser: createMockedFoodChooser({ toBuy: null }),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Если магазинов нет, план не составляется', () => {
        const task = createSatisfyHungerTask({
          foodChooser: createMockedFoodChooser({ toBuy: Item.RomashkaLoaf }),
          places: createPlaces([TEST_MEAL_SPOT]),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Если мест для трапезы нет, план не составляется: есть негде', () => {
        const task = createSatisfyHungerTask({
          foodChooser: createMockedFoodChooser({ toBuy: Item.RomashkaLoaf }),
          places: createPlaces([TEST_SHOP]),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planSteps(task, state)).toBeNull();
      });
    });
  });
});
