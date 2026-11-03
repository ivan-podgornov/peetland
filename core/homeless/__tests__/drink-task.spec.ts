import { applyPlanEffects, plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { DRINK_DURATION, DrinkTask, HOMELESS_CAMP_RADIUS } from '../src/drink-task';

/** Задачи плана «выпить» */
const DRINK = ['play-animation', 'remove-item', 'add-item'];

/** Создаёт задачу «бухать» с настоящей фабрикой примитивов, если другая не передана */
function createTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): DrinkTask {
  return new DrinkTask({
    npcTaskFactory,
    places,
  });
}

/** Создаёт мок мест, в которых есть бомжарня. NPC в ней, если inCamp */
function createPlacesWithCamp(
  inCamp: boolean,
  camp = createPlace({ type: PlaceType.HomelessCamp })
) {
  return createMockedPlaces({
    ofType: vi.fn(() => [camp]),
    findNearest: vi.fn(() => camp),
    isNear: vi.fn(() => inCamp),
  });
}

describe('DrinkTask', () => {
  it('Если NPC в бомжарне, планирует проиграть анимацию питья, отнять пойло и добавить пустую бутылку', () => {
    const task = createTask(createPlacesWithCamp(true));

    expect(
      planNames(task, new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build())
    ).toStrictEqual(DRINK);
  });

  it('Если NPC не в бомжарне, планирует сначала дойти до бомжарни, а потом выпить', () => {
    const task = createTask(createPlacesWithCamp(false));

    expect(
      planNames(task, new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build())
    ).toStrictEqual(['go-to-coords', ...DRINK]);
  });

  it('Проверяет, что NPC в бомжарне, по его позиции и HOMELESS_CAMP_RADIUS', () => {
    const places = createPlacesWithCamp(true);
    const state = new NpcStateBuilder()
      .withPosition(8, 0, 0)
      .withInventory({ [Item.Booze]: 1 })
      .build();

    plan(createTask(places), state);

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

    plan(createTask(places), state);

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
    const task = createTask(
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

  it('Пьёт стоя в течение DRINK_DURATION', () => {
    const playAnimation = vi.fn();

    createTask(createMockedPlaces(), createNpcTaskFactory({ playAnimation }));

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({
      animation: 'drink-standing-1',
      duration: DRINK_DURATION,
    });
  });

  it('По плану отнимает бутылку пойла и добавляет пустую бутылку', () => {
    const task = createTask(createPlacesWithCamp(true));

    const after = applyPlanEffects(
      task,
      new NpcStateBuilder().withInventory({ [Item.Booze]: 3 }).build()
    );

    expect(after.self.inventory).toStrictEqual({
      [Item.Booze]: 2,
      [Item.Bottles]: 1,
    });
  });

  it('Если пойла нет, план не составляется', () => {
    const task = createTask(createPlacesWithCamp(true));

    expect(planNames(task, new NpcStateBuilder().withEmptyInventory().build())).toBeNull();
  });

  it('Если бомжарен нет, план не составляется', () => {
    const task = createTask(createMockedPlaces());

    expect(
      planNames(task, new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build())
    ).toBeNull();
  });
});
