import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { InventoryCounts } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessActivityTask } from '../../src';
import { BOTTLE_PRICE, ENOUGH_MONEY } from '../../src/constants';

/** Создаёт деятельность бомжа, в которой можно выполнить любую задачу, а сдать бутылки — если sell */
function createActivityTask(sell: boolean): HomelessActivityTask {
  return new HomelessActivityTask({
    homelessTaskFactory: createHomelessTaskFactory({
      sellBottles: () => createStubTask<NpcState, NpcContext>('sell-bottles', sell),
      beg: () => createStubTask<NpcState, NpcContext>('beg'),
      collectBottles: () => createStubTask<NpcState, NpcContext>('collect-bottles'),
    }),
  });
}

/** Планирует деятельность бомжа с переданным инвентарём */
function planActivity(inventory: InventoryCounts, sell = false) {
  return planSteps(
    createActivityTask(sell),
    new NpcStateBuilder().withInventory(inventory).build()
  );
}

describe('HomelessActivityTask', () => {
  describe('Когда денег хватает', () => {
    it('Если денег ENOUGH_MONEY, не попрошайничает и не роется в мусорках', () => {
      expect(planActivity({ [Item.Money]: ENOUGH_MONEY })).toBeNull();
    });

    it('Считает и выручку за бутылки: если денег вместе с ней ENOUGH_MONEY, не попрошайничает', () => {
      const plan = planActivity({
        [Item.Money]: ENOUGH_MONEY - 2 * BOTTLE_PRICE,
        [Item.Bottles]: 2,
      });

      expect(plan).toBeNull();
    });

    it('Если денег вместе с выручкой за бутылки меньше ENOUGH_MONEY, попрошайничает', () => {
      const plan = planActivity({ [Item.Money]: ENOUGH_MONEY - 1 });

      expect(planTree(plan ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('scrape-by', 'beg', (method) => method.primitive('beg'))
          .build()
      );
    });

    it('Сдаёт бутылки, даже если денег хватает', () => {
      const plan = planActivity({ [Item.Money]: ENOUGH_MONEY }, true);

      expect(planTree(plan ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('scrape-by', 'sell-bottles', (method) => method.primitive('sell-bottles'))
          .build()
      );
    });
  });
});
