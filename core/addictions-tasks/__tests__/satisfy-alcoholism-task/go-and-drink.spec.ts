import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { TEST_SHOP, TEST_SPOT, createPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createSatisfyAlcoholismTask } from '../../dev';

/** Фабрика примитивов, в которой выпить — заглушка */
function createFactory(overrides = {}) {
  return createNpcTaskFactory({
    drink: () => createStubTask('drink'),
    ...overrides,
  });
}

describe('SatisfyAlcoholismTask', () => {
  describe('Метод go-and-drink', () => {
    it('Если пойло есть, а NPC не в месте для распития, планирует дойти до него и выпить', () => {
      const task = createSatisfyAlcoholismTask({ npcTaskFactory: createFactory() });
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

      expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('satisfy-alcoholism', 'go-and-drink', (method) =>
            method.primitive('go-to-coords').primitive('drink')
          )
          .build()
      );
    });

    it('Идёт к месту для распития, ближайшему к NPC', () => {
      const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
      const task = createSatisfyAlcoholismTask({ npcTaskFactory: createFactory({ goToCoords }) });
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

      planSteps(task, state);

      expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
        coords: TEST_SPOT.position,
        completeRadius: 0.5,
      });
    });

    it('Если мест для распития нет, план не составляется', () => {
      const task = createSatisfyAlcoholismTask({
        npcTaskFactory: createFactory(),
        places: createPlaces([TEST_SHOP]),
      });
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

      expect(planSteps(task, state)).toBeNull();
    });
  });
});
