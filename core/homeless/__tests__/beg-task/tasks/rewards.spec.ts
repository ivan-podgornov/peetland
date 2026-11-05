import { applyPlanEffects, plan } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import {
  createBegTask,
  createPlacesWithBeggingSpot,
  createTaskFactoryWithTryLuckSpy,
} from '../../../dev';
import { BEGGING_REWARD, BOOZE_PRICE, BOTTLE_PRICE } from '../../../src/constants';

describe('BegTask', () => {
  describe('Метод beg-at-nearest-spot', () => {
    describe('Задачи', () => {
      it('Если ни денег, ни бутылок нет, пытает удачу столько раз, сколько удач нужно на всё пойло', () => {
        const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();

        plan(
          createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory),
          new NpcStateBuilder().withEmptyInventory().build()
        );

        expect(tryLuck).toHaveBeenCalledTimes(BOOZE_PRICE / BEGGING_REWARD);
      });

      it('Пытает удачу столько раз, сколько удач не хватает на пойло вместе с деньгами и выручкой за бутылки', () => {
        const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
        const state = new NpcStateBuilder()
          .withInventory({
            [Item.Money]: 3 * BEGGING_REWARD,
            [Item.Bottles]: 2,
          })
          .build();

        plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), state);

        expect(tryLuck).toHaveBeenCalledTimes(
          (BOOZE_PRICE - 3 * BEGGING_REWARD - 2 * BOTTLE_PRICE) / BEGGING_REWARD
        );
      });

      it('Если не хватает не кратно BEGGING_REWARD, пытает удачу с запасом до целой удачи', () => {
        const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: BOOZE_PRICE - BEGGING_REWARD - 1 })
          .build();

        plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), state);

        expect(tryLuck).toHaveBeenCalledTimes(2);
      });

      it('За каждую удачу получает BEGGING_REWARD', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: BOOZE_PRICE - 2 * BEGGING_REWARD })
          .build();

        const after = applyPlanEffects(task, state);

        expect(after.self.inventory).toStrictEqual({ [Item.Money]: BOOZE_PRICE });
      });
    });
  });
});
