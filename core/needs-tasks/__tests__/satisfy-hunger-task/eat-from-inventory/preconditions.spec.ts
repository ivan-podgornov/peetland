import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { createMockedFoodChooser, createSatisfyHungerTask } from '../../../dev';

describe('SatisfyHungerTask', () => {
  describe('Метод eat-from-inventory', () => {
    describe('Предусловия', () => {
      it('Если IFoodChooser выбрал еду из инвентаря, план составляется', () => {
        // Магазинов нет: план составляется только из того, что есть
        const task = createSatisfyHungerTask({
          foodChooser: createMockedFoodChooser({ fromInventory: Item.RomashkaLoaf }),
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.RomashkaLoaf]: 1 })
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если IFoodChooser не нашёл еды в инвентаре, план не составляется', () => {
        const task = createSatisfyHungerTask({
          foodChooser: createMockedFoodChooser({ fromInventory: null }),
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
          .build();

        expect(planSteps(task, state)).toBeNull();
      });
    });
  });
});
