import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import {
  createMockedFoodChooser,
  createSatisfyHungerTask,
  TEST_CAMP,
  TEST_SHOP,
} from '../../../dev';
import { FOOD_PRICES } from '../../../src/constants';

describe('SatisfyHungerTask', () => {
  describe('Метод buy-food', () => {
    describe('Задачи', () => {
      it('Планирует дойти до магазина, повернуться к прилавку, купить еду, дойти до бомжарни и съесть', () => {
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({
            purchase: () => createStubTask('purchase'),
            eat: () => createStubTask('eat'),
          }),
        });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: 1000 })
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('satisfy-hunger', 'buy-food', (buy) =>
              buy
                .primitive('go-to-coords')
                .primitive('achieve-angle')
                .primitive('purchase')
                .primitive('go-to-coords')
                .primitive('eat')
            )
            .build()
        );
      });

      it('Идёт к ближайшему магазину и поворачивается к прилавку', () => {
        const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
        const achieveAngle = vi.fn(() => createStubNpcTask('achieve-angle'));
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({
            goToCoords,
            achieveAngle,
          }),
        });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: 1000 })
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(goToCoords).toHaveBeenNthCalledWith(1, {
          coords: TEST_SHOP.position,
          completeRadius: 0.5,
        });
        expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
          angle: TEST_SHOP.angle,
          tolerance: 15,
        });
      });

      it('Выбирает, что купить, из еды, на которую хватает денег', () => {
        const foodChooser = createMockedFoodChooser(Item.RomashkaLoaf);
        const task = createSatisfyHungerTask({ foodChooser });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: FOOD_PRICES[Item.SmilePizza] - 1 })
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(foodChooser.choose).toHaveBeenCalledExactlyOnceWith(state, [Item.RomashkaLoaf]);
      });

      it('Покупает одну штуку выбранной еды по её цене', () => {
        const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({ purchase }),
          foodChooser: createMockedFoodChooser(Item.SmilePizza),
        });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: 1000 })
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(purchase).toHaveBeenCalledExactlyOnceWith({
          item: Item.SmilePizza,
          count: 1,
          price: FOOD_PRICES[Item.SmilePizza],
        });
      });

      it('Съедает купленное в бомжарне, ближайшей к магазину', () => {
        const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
        const eat = vi.fn(() => createStubTask<NpcState, NpcContext>('eat'));
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({
            goToCoords,
            eat,
          }),
        });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: FOOD_PRICES[Item.SmilePizza] })
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(goToCoords).toHaveBeenLastCalledWith({
          coords: TEST_CAMP.position,
          completeRadius: 0.5,
        });
        expect(eat).toHaveBeenCalledExactlyOnceWith({ food: Item.SmilePizza });
      });
    });
  });
});
