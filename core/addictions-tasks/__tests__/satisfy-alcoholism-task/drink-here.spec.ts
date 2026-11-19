import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { createSatisfyAlcoholismTask } from '../../dev';

/** Место для распития TEST_SPOT стоит в (10, 0, 0) */
const IN_SPOT = [10, 1, 0] as const;

describe('SatisfyAlcoholismTask', () => {
  describe('Метод drink-here', () => {
    it('Если пойло есть и NPC в месте для распития, планирует выпить там же', () => {
      const task = createSatisfyAlcoholismTask({
        npcTaskFactory: createNpcTaskFactory({ drink: () => createStubTask('drink') }),
      });
      const state = new NpcStateBuilder()
        .withPosition(...IN_SPOT)
        .withInventory({ [Item.Booze]: 1 })
        .build();

      expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('satisfy-alcoholism', 'drink-here', (method) => method.primitive('drink'))
          .build()
      );
    });

    it('Пьёт пойло из инвентаря задачей «выпить»', () => {
      const drink = vi.fn(() => createStubTask<NpcState, NpcContext>('drink'));
      const task = createSatisfyAlcoholismTask({
        npcTaskFactory: createNpcTaskFactory({ drink }),
      });
      const state = new NpcStateBuilder()
        .withPosition(...IN_SPOT)
        .withInventory({ [Item.Booze]: 1 })
        .build();

      planSteps(task, state);

      expect(drink).toHaveBeenCalledExactlyOnceWith({ booze: Item.Booze });
    });
  });
});
