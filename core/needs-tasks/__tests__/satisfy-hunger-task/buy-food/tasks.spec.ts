import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { TEST_MEAL_SPOT, TEST_SHOP } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import {
  createMockedFoodChooser,
  createMockedNeedsTaskFactory,
  createSatisfyHungerTask,
} from '../../../dev';

describe('SatisfyHungerTask', () => {
  describe('Метод buy-food', () => {
    describe('Задачи', () => {
      it('Планирует купить еду, дойти до места для трапезы и съесть', () => {
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({ eat: () => createStubTask('eat') }),
          foodChooser: createMockedFoodChooser({ toBuy: Item.SmilePizza }),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('satisfy-hunger', 'buy-food', (buy) =>
              buy.primitive('buy-food').primitive('go-to-coords').primitive('eat')
            )
            .build()
        );
      });

      it('Выбирает, что купить, на текущую сытость', () => {
        const foodChooser = createMockedFoodChooser({ toBuy: Item.SmilePizza });
        const task = createSatisfyHungerTask({ foodChooser });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(foodChooser.chooseToBuy).toHaveBeenCalledWith(state, 10);
      });

      it('Покупает выбранную еду в ближайшем магазине', () => {
        const needsTaskFactory = createMockedNeedsTaskFactory();
        const task = createSatisfyHungerTask({
          needsTaskFactory,
          foodChooser: createMockedFoodChooser({ toBuy: Item.SmilePizza }),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(needsTaskFactory.buyFood).toHaveBeenCalledExactlyOnceWith({
          food: Item.SmilePizza,
          shop: TEST_SHOP,
        });
      });

      it('Съедает купленное в месте для трапезы, ближайшем к магазину', () => {
        const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
        const eat = vi.fn(() => createStubTask<NpcState, NpcContext>('eat'));
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({
            goToCoords,
            eat,
          }),
          foodChooser: createMockedFoodChooser({ toBuy: Item.SmilePizza }),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
          coords: TEST_MEAL_SPOT.position,
          completeRadius: 0.5,
        });
        expect(eat).toHaveBeenCalledExactlyOnceWith({ food: Item.SmilePizza });
      });
    });
  });
});
