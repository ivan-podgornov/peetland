import { planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createPurchaseTask } from '../../dev';

describe('PurchaseTask', () => {
  describe('Метод pay', () => {
    describe('Предусловия', () => {
      it('Если денег ровно на цену, план составляется', () => {
        const task = createPurchaseTask({ price: 100 });
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: 100 }).build();

        expect(planNames(task, state)).not.toBeNull();
      });

      it('Если денег не хватает на цену, план не составляется', () => {
        const task = createPurchaseTask({ price: 100 });
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: 99 }).build();

        expect(planNames(task, state)).toBeNull();
      });

      it('Если денег нет, план не составляется', () => {
        const task = createPurchaseTask({ price: 100 });

        expect(planNames(task, new NpcStateBuilder().withEmptyInventory().build())).toBeNull();
      });
    });
  });
});
