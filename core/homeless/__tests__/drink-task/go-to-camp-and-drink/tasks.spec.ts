import { plan, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { buildDrinkBooze, createDrinkTask, createPlacesWithCamp } from '../../../dev';

describe('DrinkTask', () => {
  describe('Метод go-to-camp-and-drink', () => {
    describe('Задачи', () => {
      it('Планирует сначала дойти до бомжарни, а потом выпить', () => {
        const task = createDrinkTask(createPlacesWithCamp(false));
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('drink', 'go-to-camp-and-drink', (drink) =>
              buildDrinkBooze(drink.primitive('go-to-coords'))
            )
            .build()
        );
      });

      it('Ищет бомжарню, ближайшую к позиции NPC из состояния', () => {
        const places = createPlacesWithCamp(false);
        const state = new NpcStateBuilder()
          .withPosition(8, 0, 0)
          .withInventory({ [Item.Booze]: 1 })
          .build();

        plan(createDrinkTask(places), state);

        expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
          {
            x: 8,
            y: 0,
            z: 0,
          },
          PlaceType.HomelessCamp
        );
      });

      it('Идёт к бомжарне, которую вернул places.findNearest', () => {
        const goToCoords = vi.fn();
        const camp = createPlace({
          type: PlaceType.HomelessCamp,
          position: {
            x: 50,
            y: 0,
            z: 0,
          },
        });
        const task = createDrinkTask(
          createPlacesWithCamp(false, camp),
          createNpcTaskFactory({ goToCoords })
        );

        plan(task, new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build());

        expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
          coords: {
            x: 50,
            y: 0,
            z: 0,
          },
          completeRadius: 0.5,
        });
      });
    });
  });
});
