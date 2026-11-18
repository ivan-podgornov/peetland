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
      it('Выбирает еду из инвентаря на текущую сытость', () => {
        const foodChooser = createMockedFoodChooser({ fromInventory: Item.RomashkaLoaf });
        const task = createSatisfyHungerTask({
          foodChooser,
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(foodChooser.chooseFromInventory).toHaveBeenCalledWith(state, 10);
      });

      it('Съедает выбранную еду', () => {
        const eat = vi.fn(() => createStubTask<NpcState, NpcContext>('eat'));
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({ eat }),
          foodChooser: createMockedFoodChooser({ fromInventory: Item.RomashkaLoaf }),
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        planSteps(task, state);

        expect(eat).toHaveBeenCalledExactlyOnceWith({ food: Item.RomashkaLoaf });
      });
    });
  });
});
