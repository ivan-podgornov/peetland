import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { createMockedFoodChooser, createStockFoodTask, TEST_SHOP } from '../../dev';
import { EATING_SATIETY, FOOD_PRICES } from '../../src/constants';

/** Состояние NPC с умеренной сытостью и переданными деньгами */
function createStateWithMoney(money: number) {
  return new NpcStateBuilder()
    .withInventory({ [Item.Money]: money })
    .withNeeds((needs) => needs.withValue(Need.Satiety, 40).build())
    .build();
}

describe('StockFoodTask', () => {
  describe('Метод buy-food', () => {
    describe('Задачи', () => {
      it('Планирует дойти до магазина, повернуться к прилавку и купить еду, но не есть', () => {
        const task = createStockFoodTask({
          npcTaskFactory: createNpcTaskFactory({ purchase: () => createStubTask('purchase') }),
        });

        expect(planTree(planSteps(task, createStateWithMoney(1000)) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('stock-food', 'buy-food', (buy) =>
              buy.primitive('go-to-coords').primitive('achieve-angle').primitive('purchase')
            )
            .build()
        );
      });

      it('Идёт к ближайшему магазину и поворачивается к прилавку', () => {
        const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
        const achieveAngle = vi.fn(() => createStubNpcTask('achieve-angle'));
        const task = createStockFoodTask({
          npcTaskFactory: createNpcTaskFactory({
            goToCoords,
            achieveAngle,
          }),
        });

        planSteps(task, createStateWithMoney(1000));

        expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
          coords: TEST_SHOP.position,
          completeRadius: 0.5,
        });
        expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
          angle: TEST_SHOP.angle,
          tolerance: 15,
        });
      });

      it('Выбирает из еды, на которую хватает денег, на сытость, при которой её съест', () => {
        const foodChooser = createMockedFoodChooser(Item.RomashkaLoaf);
        const task = createStockFoodTask({ foodChooser });
        const state = createStateWithMoney(FOOD_PRICES[Item.SmilePizza] - 1);

        planSteps(task, state);

        expect(foodChooser.choose).toHaveBeenCalledExactlyOnceWith(
          state,
          [Item.RomashkaLoaf],
          EATING_SATIETY
        );
      });

      it('Покупает одну штуку выбранной еды по её цене', () => {
        const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
        const task = createStockFoodTask({
          npcTaskFactory: createNpcTaskFactory({ purchase }),
          foodChooser: createMockedFoodChooser(Item.SmilePizza),
        });

        planSteps(task, createStateWithMoney(1000));

        expect(purchase).toHaveBeenCalledExactlyOnceWith({
          item: Item.SmilePizza,
          count: 1,
          price: FOOD_PRICES[Item.SmilePizza],
        });
      });
    });
  });
});
