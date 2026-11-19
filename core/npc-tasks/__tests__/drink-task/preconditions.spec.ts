import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createDrinkTask } from '../../dev';

describe('DrinkTask', () => {
  describe('Метод drink-booze', () => {
    describe('Предусловия', () => {
      it('Если пойло есть в инвентаре, план составляется', () => {
        const task = createDrinkTask({ booze: Item.Booze });
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если пойла нет в инвентаре, план не составляется', () => {
        const task = createDrinkTask({ booze: Item.Booze });
        const state = new NpcStateBuilder().withInventory({ [Item.Bottles]: 1 }).build();

        expect(planSteps(task, state)).toBeNull();
      });
    });
  });
});
