import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { DRINK_PLAN, createDrinkTask, createPlacesWithCamp } from '../../dev';
import { HOMELESS_CAMP_RADIUS } from '../../src/drink-task';

describe('DrinkTask', () => {
  it('Если NPC не в бомжарне, планирует сначала дойти до бомжарни, а потом выпить', () => {
    const task = createDrinkTask(createPlacesWithCamp(false));

    expect(
      planNames(task, new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build())
    ).toStrictEqual(['go-to-coords', ...DRINK_PLAN]);
  });

  it('Проверяет, что NPC в бомжарне, по его позиции и HOMELESS_CAMP_RADIUS', () => {
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
      HOMELESS_CAMP_RADIUS
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

  it('Если бомжарен нет, план не составляется', () => {
    const task = createDrinkTask(createMockedPlaces());

    expect(
      planNames(task, new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build())
    ).toBeNull();
  });
});
