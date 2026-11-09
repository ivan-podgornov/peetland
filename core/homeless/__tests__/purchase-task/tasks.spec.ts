import { applyPlanEffects, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { createPurchaseTask } from '../../dev';

describe('PurchaseTask', () => {
  describe('Метод pay', () => {
    describe('Задачи', () => {
      it('Планирует заплатить, отнять деньги и добавить предмет', () => {
        const task = createPurchaseTask({ price: 100 });
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: 100 }).build();

        expect(planNames(task, state)).toStrictEqual(['play-animation', 'remove-item', 'add-item']);
      });

      it('Платит с анимацией оплаты', () => {
        const playAnimation = vi.fn();

        createPurchaseTask({}, createNpcTaskFactory({ playAnimation }));

        expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'pay' });
      });

      it('По плану отнимает цену и добавляет предмет', () => {
        const task = createPurchaseTask({
          item: Item.Booze,
          count: 2,
          price: 100,
        });
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: 150 }).build();

        const after = applyPlanEffects(task, state);

        expect(after.self.inventory.getAll()).toStrictEqual({
          [Item.Money]: 50,
          [Item.Booze]: 2,
        });
      });
    });
  });
});
