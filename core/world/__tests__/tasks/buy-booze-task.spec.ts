import { Geometry } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, BuyBoozeTask, PlaceType } from '../../src';
import type { ITaskFactory, PlaceData } from '../../src';

import {
  createNpcState,
  createPlace,
  createStubTask,
  createTaskFactory,
  plan,
  planNames,
} from './helpers';

/** Создаёт задачу покупки пойла с настоящей фабрикой задач, если другая не передана */
function createTask(
  places: readonly PlaceData[],
  taskFactory: ITaskFactory = createTaskFactory()
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
    const task = createTask(
      [createPlace()],
      createTaskFactory({ purchase: () => createStubTask('purchase') })
    );

    expect(planNames(task, createStateWithMoney())).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'purchase',
    ]);
  });

  it('Покупает одну бутылку пойла за BOOZE_PRICE', () => {
    const purchase = vi.fn(() => createStubTask('purchase'));
    const task = createTask([createPlace()], createTaskFactory({ purchase }));

    plan(task, createStateWithMoney());

    expect(purchase).toHaveBeenCalledExactlyOnceWith({
      item: Item.Booze,
      count: 1,
      price: BOOZE_PRICE,
    });
  });

  it('Идёт к ближайшему магазину, а не к ближайшему месту другого типа', () => {
    const goToCoords = vi.fn();
    const task = createTask(
      [
        createPlace({ id: 'trash', type: PlaceType.TrashBin, position: { x: 1, y: 0, z: 0 } }),
        createPlace({ id: 'far-shop', position: { x: 100, y: 0, z: 0 } }),
        createPlace({ id: 'near-shop', position: { x: 50, y: 0, z: 0 } }),
      ],
      createTaskFactory({ goToCoords })
    );

    plan(task, createStateWithMoney());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Выбирает магазин, ближайший к позиции NPC из состояния', () => {
    const goToCoords = vi.fn();
    const task = createTask(
      [
        createPlace({ id: 'west', position: { x: -10, y: 0, z: 0 } }),
        createPlace({ id: 'east', position: { x: 10, y: 0, z: 0 } }),
      ],
      createTaskFactory({ goToCoords })
    );

    plan(task, createStateWithMoney({ x: 8, y: 0, z: 0 }));

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 10, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к прилавку ближайшего магазина', () => {
    const achieveAngle = vi.fn();
    const task = createTask(
      [
        createPlace({ id: 'far-shop', position: { x: 100, y: 0, z: 0 }, angle: 10 }),
        createPlace({ id: 'near-shop', position: { x: 50, y: 0, z: 0 }, angle: 90 }),
      ],
      createTaskFactory({ achieveAngle })
    );

    plan(task, createStateWithMoney());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({ angle: 90, tolerance: 15 });
  });

  it('Если магазинов нет, план не составляется', () => {
    const task = createTask([createPlace({ type: PlaceType.TrashBin })]);

    expect(planNames(task, createStateWithMoney())).toBeNull();
  });
});
