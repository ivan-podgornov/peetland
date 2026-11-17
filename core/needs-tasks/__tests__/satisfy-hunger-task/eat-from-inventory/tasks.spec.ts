import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createSatisfyHungerTask } from '../../../dev';

describe('SatisfyHungerTask', () => {
  describe('Метод eat-from-inventory', () => {
    describe('Задачи', () => {
      // «Ромашка» восполняет 60 сытости, «Смайл» — 100
      it.each<{ satiety: number; inventory: Food[]; food: Food; reason: string }>([
        {
          satiety: 40,
          inventory: [Item.RomashkaLoaf, Item.SmilePizza],
          food: Item.RomashkaLoaf,
          reason: 'до максимума добивает и то и другое, но «Ромашка» меньше переедает',
        },
        {
          satiety: 30,
          inventory: [Item.RomashkaLoaf, Item.SmilePizza],
          food: Item.SmilePizza,
          reason: 'до максимума добивает только «Смайл»',
        },
        {
          satiety: 20,
          inventory: [Item.RomashkaLoaf],
          food: Item.RomashkaLoaf,
          reason: 'до максимума ничто не добивает, а другой еды нет',
        },
      ])('При сытости $satiety ест $food: $reason', ({ satiety, inventory, food }) => {
        const eat = vi.fn(() => createStubTask<NpcState, NpcContext>('eat'));
        const task = createSatisfyHungerTask({
          npcTaskFactory: createNpcTaskFactory({ eat }),
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withInventory(Object.fromEntries(inventory.map((item) => [item, 1])))
          .withNeeds({ [Need.Satiety]: satiety })
          .build();

        planSteps(task, state);

        expect(eat).toHaveBeenCalledExactlyOnceWith({ food });
      });
    });
  });
});
