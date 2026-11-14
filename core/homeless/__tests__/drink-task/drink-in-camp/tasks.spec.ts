import { applyPlanEffects, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { buildDrinkBooze, createDrinkTask, createPlacesWithCamp } from '../../../dev';
import { DrinkTask } from '../../../src/drink-task';

describe('DrinkTask', () => {
  describe('Метод drink-in-camp', () => {
    describe('Задачи', () => {
      it('Планирует проиграть анимацию питья, отнять пойло и добавить пустую бутылку', () => {
        const task = createDrinkTask(createPlacesWithCamp(true));
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder().compound('drink', 'drink-in-camp', buildDrinkBooze).build()
        );
      });

      it('Пьёт стоя в течение DrinkTask.DURATION', () => {
        const playAnimation = vi.fn();

        createDrinkTask(createPlacesWithCamp(true), createNpcTaskFactory({ playAnimation }));

        expect(playAnimation).toHaveBeenCalledExactlyOnceWith({
          animation: 'drink-standing-1',
          duration: DrinkTask.DURATION,
        });
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
