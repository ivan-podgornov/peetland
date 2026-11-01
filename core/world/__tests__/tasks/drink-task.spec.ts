import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { DRINK_DURATION, DrinkTask, HOMELESS_CAMP_RADIUS, PlaceType } from '../../src';
import type { ITaskFactory, NpcState, PlaceData } from '../../src';

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

/** Создаёт бомжарню. Поля, которые не переданы, заполняются незначимыми значениями */
function createCamp(place: Partial<PlaceData> = {}): PlaceData {
  return createPlace({ id: 'camp', type: PlaceType.HomelessCamp, ...place });
}

/** Создаёт задачу «бухать» с настоящей фабрикой задач, если другая не передана */
function createTask(
  places: readonly PlaceData[],
  taskFactory: ITaskFactory = createTaskFactory()
): DrinkTask {
  return new DrinkTask({ places }, { geometry: new Geometry(), taskFactory });
}

/** Состояние NPC с пойлом в переданной позиции */
function createStateWithBooze(position: Vector3 = { x: 0, y: 0, z: 0 }, booze = 1): NpcState {
  return createNpcState({ actor: { position, angle: 0 }, inventory: { [Item.Booze]: booze } });
}

describe('DrinkTask', () => {
  it('Если NPC в бомжарне, планирует проиграть анимацию питья, отнять пойло и добавить пустую бутылку', () => {
    const task = createTask([createCamp()]);

    expect(planNames(task, createStateWithBooze())).toStrictEqual(DRINK);
  });

  it('Если NPC на границе радиуса бомжарни, планирует пить на месте', () => {
    const task = createTask([createCamp()]);
    const state = createStateWithBooze({ x: HOMELESS_CAMP_RADIUS, y: 0, z: 0 });

    expect(planNames(task, state)).toStrictEqual(DRINK);
  });

  it('Если NPC не в бомжарне, планирует сначала дойти до бомжарни, а потом выпить', () => {
    const task = createTask([createCamp()]);
    const state = createStateWithBooze({ x: HOMELESS_CAMP_RADIUS + 1, y: 0, z: 0 });

    expect(planNames(task, state)).toStrictEqual(['go-to-coords', ...DRINK]);
  });

  it('Идёт к ближайшей бомжарне, а не к ближайшему месту другого типа', () => {
    const goToCoords = vi.fn();
    const task = createTask(
      [
        createPlace({ id: 'shop', type: PlaceType.Shop, position: { x: 10, y: 0, z: 0 } }),
        createCamp({ id: 'far-camp', position: { x: 100, y: 0, z: 0 } }),
        createCamp({ id: 'near-camp', position: { x: 50, y: 0, z: 0 } }),
      ],
      createTaskFactory({ goToCoords })
    );

    plan(task, createStateWithBooze());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Пьёт стоя в течение DRINK_DURATION', () => {
    const playAnimation = vi.fn();

    createTask([createCamp()], createTaskFactory({ playAnimation }));

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({
      animation: 'drink-standing-1',
      duration: DRINK_DURATION,
    });
  });

  it('По плану отнимает бутылку пойла и добавляет пустую бутылку', () => {
    const task = createTask([createCamp()]);

    const after = applyPlanEffects(task, createStateWithBooze(undefined, 3));

    expect(after.inventory).toStrictEqual({ [Item.Booze]: 2, [Item.Bottles]: 1 });
  });

  it('Если пойла нет, план не составляется', () => {
    const task = createTask([createCamp()]);

    expect(planNames(task, createNpcState({ inventory: {} }))).toBeNull();
  });

  it('Если бомжарен нет, план не составляется', () => {
    const task = createTask([createPlace({ type: PlaceType.Shop })]);

    expect(planNames(task, createStateWithBooze())).toBeNull();
  });
});
