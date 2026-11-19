import { applyPlanEffects, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { buildDrinkBooze, createDrinkTask, createPlacesWithCamp } from '../../../dev';

describe('DrinkTask', () => {
  describe('Метод drink-in-camp', () => {
    describe('Задачи', () => {
      it('Планирует выпить пойло', () => {
        const task = createDrinkTask(createPlacesWithCamp(true));
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder().compound('drink', 'drink-in-camp', buildDrinkBooze).build()
        );
      });

      it('Пьёт пойло задачей «выпить» из фабрики примитивов', () => {
        const drink = vi.fn(() => createStubNpcTask('drink'));

        createDrinkTask(createPlacesWithCamp(true), createNpcTaskFactory({ drink }));

        expect(drink).toHaveBeenCalledExactlyOnceWith({ booze: Item.Booze });
      });

      it('По плану отнимает бутылку пойла и добавляет пустую бутылку', () => {
        const task = createDrinkTask(createPlacesWithCamp(true));
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 3 }).build();

        const after = applyPlanEffects(task, state);

        expect(after.self.inventory.getAll()).toStrictEqual({
          [Item.Booze]: 2,
          [Item.Bottles]: 1,
        });
      });
    });
  });
});
