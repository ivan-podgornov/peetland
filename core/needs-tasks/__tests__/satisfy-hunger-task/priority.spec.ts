import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it } from 'vitest';

import { createSatisfyHungerTask } from '../../dev';

describe('SatisfyHungerTask', () => {
  describe('Порядок методов', () => {
    it('Если еда есть и денег хватает на новую, ест то, что есть', () => {
      const task = createSatisfyHungerTask({
        npcTaskFactory: createNpcTaskFactory({ eat: () => createStubTask('eat') }),
      });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.RomashkaLoaf]: 1,
          [Item.Money]: 1000,
        })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
        .build();

      expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('satisfy-hunger', 'eat-from-inventory', (method) => method.primitive('eat'))
          .build()
      );
    });
  });
});
