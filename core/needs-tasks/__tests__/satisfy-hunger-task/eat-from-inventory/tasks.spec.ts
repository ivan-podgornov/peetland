import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createMockedFoodChooser, createSatisfyHungerTask } from '../../../dev';

describe('SatisfyHungerTask', () => {
  describe('Метод eat-from-inventory', () => {
    describe('Задачи', () => {
      it('Выбирает, что съесть, из еды в инвентаре', () => {
        const foodChooser = createMockedFoodChooser();
        const task = createSatisfyHungerTask({
          foodChooser,
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withInventory({
            [Item.RomashkaLoaf]: 1,
            [Item.SmilePizza]: 1,
            [Item.Money]: 10,
          })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        planSteps(task, state);

        expect(foodChooser.choose).toHaveBeenCalledExactlyOnceWith(state, [
          Item.RomashkaLoaf,
          Item.SmilePizza,
        ]);
      });

      it('Съедает выбранную еду', () => {
        const eat = vi.fn(() => createStubTask<NpcState, NpcContext>('eat'));
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({ eat }),
          foodChooser: createMockedFoodChooser(Item.RomashkaLoaf),
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withInventory({
            [Item.RomashkaLoaf]: 1,
            [Item.SmilePizza]: 1,
          })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        planSteps(task, state);

        expect(eat).toHaveBeenCalledExactlyOnceWith({ food: Item.RomashkaLoaf });
      });
    });
  });
});
