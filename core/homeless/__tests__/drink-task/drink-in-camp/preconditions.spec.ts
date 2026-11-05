import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { PlaceType } from '@peetland/places';
import { describe, expect, it } from 'vitest';

import { createDrinkTask, createPlacesWithCamp } from '../../../dev';
import { DrinkTask } from '../../../src/drink-task';

describe('DrinkTask', () => {
  describe('Метод drink-in-camp', () => {
    describe('Предусловия', () => {
      it('Если пойло есть и NPC в бомжарне, пьёт на месте и никуда не идёт', () => {
        const task = createDrinkTask(createPlacesWithCamp(true));
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planNames(task, state)).not.toContain('go-to-coords');
      });

      it('Если пойла нет, план не составляется, даже если NPC в бомжарне', () => {
        const task = createDrinkTask(createPlacesWithCamp(true));

        expect(planNames(task, new NpcStateBuilder().withEmptyInventory().build())).toBeNull();
      });

      it('Проверяет, что NPC в бомжарне, по его позиции и DrinkTask.CAMP_RADIUS', () => {
        const places = createPlacesWithCamp(true);
        const state = new NpcStateBuilder()
          .withPosition(8, 0, 0)
          .withInventory({ [Item.Booze]: 1 })
          .build();

        plan(createDrinkTask(places), state);

        expect(places.isNear).toHaveBeenCalledWith(
          {
            x: 8,
            y: 0,
            z: 0,
          },
          PlaceType.HomelessCamp,
          DrinkTask.CAMP_RADIUS
        );
      });
    });
  });
});
