import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { DRINK_DURATION, DrinkTask, HOMELESS_CAMP_RADIUS, PlaceType } from '../../src';
import type { IPlaces, ITaskFactory, NpcState } from '../../src';
import { createMockedPlaces } from '../places/helpers';

import {
  applyPlanEffects,
  createNpcState,
  createPlace,
  createTaskFactory,
  plan,
  planNames,
} from './helpers';

/** Задачи плана «выпить» */
const DRINK = ['play-animation', 'remove-item', 'add-item'];

/** Создаёт задачу «бухать» с настоящей фабрикой задач, если другая не передана */
function createTask(places: IPlaces, taskFactory: ITaskFactory = createTaskFactory()): DrinkTask {
  return new DrinkTask({ places }, { taskFactory });
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

/** Состояние NPC с пойлом */
function createStateWithBooze(booze = 1): NpcState {
  return createNpcState({ inventory: { [Item.Booze]: booze } });
}

describe('DrinkTask', () => {
  it('Если NPC в бомжарне, планирует проиграть анимацию питья, отнять пойло и добавить пустую бутылку', () => {
    const task = createTask(createPlacesWithCamp(true));

    expect(planNames(task, createStateWithBooze())).toStrictEqual(DRINK);
  });

  it('Если NPC не в бомжарне, планирует сначала дойти до бомжарни, а потом выпить', () => {
    const task = createTask(createPlacesWithCamp(false));

    expect(planNames(task, createStateWithBooze())).toStrictEqual(['go-to-coords', ...DRINK]);
  });

  it('Проверяет, что NPC в бомжарне, по его позиции и HOMELESS_CAMP_RADIUS', () => {
    const places = createPlacesWithCamp(true);
    const state = createNpcState({
      actor: { position: { x: 8, y: 0, z: 0 }, angle: 0 },
      inventory: { [Item.Booze]: 1 },
    });

    plan(createTask(places), state);

    expect(places.isNear).toHaveBeenCalledWith(
      { x: 8, y: 0, z: 0 },
      PlaceType.HomelessCamp,
      HOMELESS_CAMP_RADIUS
    );
  });

  it('Ищет бомжарню, ближайшую к позиции NPC из состояния', () => {
    const places = createPlacesWithCamp(false);
    const state = createNpcState({
      actor: { position: { x: 8, y: 0, z: 0 }, angle: 0 },
      inventory: { [Item.Booze]: 1 },
    });

    plan(createTask(places), state);

    expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
      { x: 8, y: 0, z: 0 },
      PlaceType.HomelessCamp
    );
  });

  it('Идёт к бомжарне, которую вернул places.findNearest', () => {
    const goToCoords = vi.fn();
    const camp = createPlace({ type: PlaceType.HomelessCamp, position: { x: 50, y: 0, z: 0 } });
    const task = createTask(createPlacesWithCamp(false, camp), createTaskFactory({ goToCoords }));

    plan(task, createStateWithBooze());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Пьёт стоя в течение DRINK_DURATION', () => {
    const playAnimation = vi.fn();

    createTask(createMockedPlaces(), createTaskFactory({ playAnimation }));

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({
      animation: 'drink-standing-1',
      duration: DRINK_DURATION,
    });
  });

  it('По плану отнимает бутылку пойла и добавляет пустую бутылку', () => {
    const task = createTask(createPlacesWithCamp(true));

    const after = applyPlanEffects(task, createStateWithBooze(3));

    expect(after.inventory).toStrictEqual({ [Item.Booze]: 2, [Item.Bottles]: 1 });
  });

  it('Если пойла нет, план не составляется', () => {
    const task = createTask(createPlacesWithCamp(true));

    expect(planNames(task, createNpcState({ inventory: {} }))).toBeNull();
  });

  it('Если бомжарен нет, план не составляется', () => {
    const task = createTask(createMockedPlaces());

    expect(planNames(task, createStateWithBooze())).toBeNull();
  });
});
