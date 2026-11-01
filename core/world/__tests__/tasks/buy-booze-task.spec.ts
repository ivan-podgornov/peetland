import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, BuyBoozeTask, PlaceType } from '../../src';
import type { IPlaces, ITaskFactory } from '../../src';
import { createMockedPlaces } from '../places/helpers';

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
  places: IPlaces,
  taskFactory: ITaskFactory = createTaskFactory()
): BuyBoozeTask {
  return new BuyBoozeTask({ places }, { taskFactory });
}

/** Создаёт мок мест, в которых есть переданный магазин, и он же ближайший */
function createPlacesWithShop(shop = createPlace()) {
  return createMockedPlaces({ ofType: vi.fn(() => [shop]), findNearest: vi.fn(() => shop) });
}

describe('BuyBoozeTask', () => {
  it('Планирует дойти до магазина, повернуться к прилавку и купить пойло', () => {
    const task = createTask(
      createPlacesWithShop(),
      createTaskFactory({ purchase: () => createStubTask('purchase') })
    );

    expect(planNames(task, createNpcState())).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'purchase',
    ]);
  });

  it('Ищет магазин, ближайший к позиции NPC из состояния', () => {
    const places = createPlacesWithShop();
    const state = createNpcState({ actor: { position: { x: 8, y: 0, z: 0 }, angle: 0 } });

    plan(createTask(places), state);

    expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
      { x: 8, y: 0, z: 0 },
      PlaceType.Shop
    );
  });

  it('Идёт к магазину, который вернул places.findNearest', () => {
    const goToCoords = vi.fn();
    const shop = createPlace({ position: { x: 50, y: 0, z: 0 } });
    const task = createTask(createPlacesWithShop(shop), createTaskFactory({ goToCoords }));

    plan(task, createNpcState());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к прилавку магазина, который вернул places.findNearest', () => {
    const achieveAngle = vi.fn();
    const shop = createPlace({ angle: 90 });
    const task = createTask(createPlacesWithShop(shop), createTaskFactory({ achieveAngle }));

    plan(task, createNpcState());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({ angle: 90, tolerance: 15 });
  });

  it('Покупает одну бутылку пойла за BOOZE_PRICE', () => {
    const purchase = vi.fn(() => createStubTask('purchase'));
    const task = createTask(createPlacesWithShop(), createTaskFactory({ purchase }));

    plan(task, createNpcState());

    expect(purchase).toHaveBeenCalledExactlyOnceWith({
      item: Item.Booze,
      count: 1,
      price: BOOZE_PRICE,
    });
  });

  it('Если магазинов нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    expect(planNames(createTask(places), createNpcState())).toBeNull();
  });

  it('Спрашивает у places магазины', () => {
    const places = createMockedPlaces();

    plan(createTask(places), createNpcState());

    expect(places.ofType).toHaveBeenCalledWith(PlaceType.Shop);
  });
});
