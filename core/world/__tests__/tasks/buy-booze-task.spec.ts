import { Geometry } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, BuyBoozeTask, PlaceType } from '../../src';
import type { PlaceData, TaskFactory } from '../../src';

import { createNpcState, createPlace, createTaskFactory, plan, planNames } from './helpers';

/** Создаёт задачу покупки пойла с настоящей фабрикой задач, если другая не передана */
function createTask(
  places: readonly PlaceData[],
  taskFactory: TaskFactory = createTaskFactory()
): BuyBoozeTask {
  return new BuyBoozeTask({ places }, { geometry: new Geometry(), taskFactory });
}

/** Состояние NPC, у которого хватает денег на пойло */
function createStateWithMoney(position = { x: 0, y: 0, z: 0 }) {
  return createNpcState({
    actor: { position, angle: 0 },
    inventory: { [Item.Money]: BOOZE_PRICE },
  });
}

describe('BuyBoozeTask', () => {
  it('Планирует дойти до магазина, повернуться к прилавку и купить пойло', () => {
    const names = planNames(createTask([createPlace()]), createStateWithMoney());

    expect(names).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'play-animation',
      'remove-item',
      'add-item',
    ]);
  });

  it('Идёт к ближайшему магазину, а не к ближайшему месту другого типа', () => {
    const taskFactory = createTaskFactory();
    const goToCoords = vi.spyOn(taskFactory, 'goToCoords');
    const task = createTask(
      [
        createPlace({ id: 'trash', type: PlaceType.TrashBin, position: { x: 1, y: 0, z: 0 } }),
        createPlace({ id: 'far-shop', position: { x: 100, y: 0, z: 0 } }),
        createPlace({ id: 'near-shop', position: { x: 50, y: 0, z: 0 } }),
      ],
      taskFactory
    );

    plan(task, createStateWithMoney());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Выбирает магазин, ближайший к позиции NPC из состояния', () => {
    const taskFactory = createTaskFactory();
    const goToCoords = vi.spyOn(taskFactory, 'goToCoords');
    const task = createTask(
      [
        createPlace({ id: 'west', position: { x: -10, y: 0, z: 0 } }),
        createPlace({ id: 'east', position: { x: 10, y: 0, z: 0 } }),
      ],
      taskFactory
    );

    plan(task, createStateWithMoney({ x: 8, y: 0, z: 0 }));

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 10, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к прилавку ближайшего магазина', () => {
    const taskFactory = createTaskFactory();
    const achieveAngle = vi.spyOn(taskFactory, 'achieveAngle');
    const task = createTask(
      [
        createPlace({ id: 'far-shop', position: { x: 100, y: 0, z: 0 }, angle: 10 }),
        createPlace({ id: 'near-shop', position: { x: 50, y: 0, z: 0 }, angle: 90 }),
      ],
      taskFactory
    );

    plan(task, createStateWithMoney());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({ angle: 90, tolerance: 15 });
  });

  it('Если денег меньше 100 $, план не составляется', () => {
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - 1 } });

    expect(planNames(createTask([createPlace()]), state)).toBeNull();
  });

  it('Если магазинов нет, план не составляется', () => {
    const task = createTask([createPlace({ type: PlaceType.TrashBin })]);

    expect(planNames(task, createStateWithMoney())).toBeNull();
  });
});
