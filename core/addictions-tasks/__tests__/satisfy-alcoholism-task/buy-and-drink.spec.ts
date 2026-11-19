import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { TEST_SHOP, TEST_MEAL_SPOT, createPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createMockedAddictionsTaskFactory, createSatisfyAlcoholismTask } from '../../dev';
import { BOOZE_PRICE } from '../../src/constants';

/** Состояние NPC, у которого пойла нет, а денег ровно на него */
function createStateWithMoney(money = BOOZE_PRICE) {
  return new NpcStateBuilder().withInventory({ [Item.Money]: money }).build();
}

describe('SatisfyAlcoholismTask', () => {
  describe('Метод buy-and-drink', () => {
    it('Если пойла нет, а денег хватает, планирует купить пойло, дойти до места для трапезы и выпить', () => {
      const task = createSatisfyAlcoholismTask({
        npcTaskFactory: createNpcTaskFactory({ drink: () => createStubTask('drink') }),
      });

      expect(planTree(planSteps(task, createStateWithMoney()) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('satisfy-alcoholism', 'buy-and-drink', (method) =>
            method.primitive('buy-booze').primitive('go-to-coords').primitive('drink')
          )
          .build()
      );
    });

    it('Покупает пойло в магазине, ближайшем к NPC', () => {
      const addictionsTaskFactory = createMockedAddictionsTaskFactory();
      const task = createSatisfyAlcoholismTask({ addictionsTaskFactory });

      planSteps(task, createStateWithMoney());

      expect(addictionsTaskFactory.buyBooze).toHaveBeenCalledExactlyOnceWith({ shop: TEST_SHOP });
    });

    it('Пьёт в месте для трапезы, ближайшем к магазину', () => {
      const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
      const task = createSatisfyAlcoholismTask({
        npcTaskFactory: createNpcTaskFactory({ goToCoords }),
      });

      planSteps(task, createStateWithMoney());

      expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
        coords: TEST_MEAL_SPOT.position,
        completeRadius: 0.5,
      });
    });

    it('Если денег не хватает на пойло, план не составляется', () => {
      const task = createSatisfyAlcoholismTask();

      expect(planSteps(task, createStateWithMoney(BOOZE_PRICE - 1))).toBeNull();
    });

    it('Если магазинов нет, план не составляется', () => {
      const task = createSatisfyAlcoholismTask({ places: createPlaces([TEST_MEAL_SPOT]) });

      expect(planSteps(task, createStateWithMoney())).toBeNull();
    });
  });
});
