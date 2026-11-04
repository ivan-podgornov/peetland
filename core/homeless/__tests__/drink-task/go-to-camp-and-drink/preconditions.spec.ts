import { planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { createDrinkTask, createPlacesWithCamp } from '../../../dev';

describe('DrinkTask', () => {
  describe('Метод go-to-camp-and-drink', () => {
    describe('Предусловия', () => {
      it('Если пойло есть, NPC не в бомжарне и бомжарни есть, план составляется', () => {
        const task = createDrinkTask(createPlacesWithCamp(false));
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planNames(task, state)).not.toBeNull();
      });

      it('Если пойла нет, план не составляется', () => {
        const task = createDrinkTask(createPlacesWithCamp(false));

        expect(planNames(task, new NpcStateBuilder().withEmptyInventory().build())).toBeNull();
      });

      it('Если бомжарен нет, план не составляется', () => {
        const task = createDrinkTask(createMockedPlaces());
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planNames(task, state)).toBeNull();
      });
    });
  });
});
