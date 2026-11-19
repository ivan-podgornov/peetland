import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it } from 'vitest';

import { createSatisfyAlcoholismTask } from '../../dev';
import { BOOZE_PRICE } from '../../src/constants';

describe('SatisfyAlcoholismTask', () => {
  describe('Порядок методов', () => {
    it('Если пойло есть и денег хватает на новое, пьёт то, что есть', () => {
      const task = createSatisfyAlcoholismTask({
        npcTaskFactory: createNpcTaskFactory({ drink: () => createStubTask('drink') }),
      });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.Booze]: 1,
          [Item.Money]: BOOZE_PRICE,
        })
        .build();

      expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('satisfy-alcoholism', 'go-and-drink', (method) =>
            method.primitive('go-to-coords').primitive('drink')
          )
          .build()
      );
    });
  });
});
