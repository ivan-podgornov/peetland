import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, BOTTLE_PRICE, PlaceType, SellBottlesTask } from '../../src';
import type { IPlaces, ITaskFactory } from '../../src';
import { createMockedPlaces } from '../places/helpers';

import { createNpcState, createPlace, createTaskFactory, plan, planNames } from './helpers';

/** Создаёт задачу сдачи бутылок с настоящей фабрикой задач, если другая не передана */
function createTask(
  places: IPlaces,
  taskFactory: ITaskFactory = createTaskFactory()
): SellBottlesTask {
  return new SellBottlesTask({ places }, { taskFactory });
}

/** Создаёт мок мест, в которых есть переданная приёмка, и она же ближайшая */
function createPlacesWithCollection(
  collection = createPlace({ type: PlaceType.BottleCollection })
) {
  return createMockedPlaces({
    ofType: vi.fn(() => [collection]),
    findNearest: vi.fn(() => collection),
  });
}

/** Сколько бутылок нужно сдать, чтобы хватило на пойло, если денег нет */
const BOTTLES_FOR_BOOZE = BOOZE_PRICE / BOTTLE_PRICE;

describe('SellBottlesTask', () => {
  it('Планирует дойти до приёмки, повернуться к приёмщику, отдать бутылки и получить деньги', () => {
    const task = createTask(createPlacesWithCollection());

    const names = planNames(
      task,
      createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE } })
    );

    expect(names).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'play-animation',
      'remove-item',
      'add-item',
    ]);
  });

  it('Ищет приёмку, ближайшую к позиции NPC из состояния', () => {
    const places = createPlacesWithCollection();
    const state = createNpcState({
      actor: { position: { x: 8, y: 0, z: 0 }, angle: 0 },
      inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE },
    });

    plan(createTask(places), state);

    expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
      { x: 8, y: 0, z: 0 },
      PlaceType.BottleCollection
    );
  });

  it('Идёт к приёмке, которую вернул places.findNearest', () => {
    const goToCoords = vi.fn();
    const collection = createPlace({
      type: PlaceType.BottleCollection,
      position: { x: 50, y: 0, z: 0 },
    });
    const task = createTask(
      createPlacesWithCollection(collection),
      createTaskFactory({ goToCoords })
    );

    plan(task, createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE } }));

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к приёмщику приёмки, которую вернул places.findNearest', () => {
    const achieveAngle = vi.fn();
    const collection = createPlace({ type: PlaceType.BottleCollection, angle: 90 });
    const task = createTask(
      createPlacesWithCollection(collection),
      createTaskFactory({ achieveAngle })
    );

    plan(task, createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE } }));

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({ angle: 90, tolerance: 15 });
  });

  it('Отдаёт бутылки с анимацией item-give', () => {
    const playAnimation = vi.fn();
    const task = createTask(createPlacesWithCollection(), createTaskFactory({ playAnimation }));

    plan(task, createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE } }));

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'item-give' });
  });

  it('Отдаёт все бутылки из состояния', () => {
    const removeItem = vi.fn();
    const task = createTask(createPlacesWithCollection(), createTaskFactory({ removeItem }));

    plan(task, createNpcState({ inventory: { [Item.Bottles]: 12 } }));

    expect(removeItem).toHaveBeenCalledExactlyOnceWith({ item: Item.Bottles, count: 12 });
  });

  it('Получает BOTTLE_PRICE за каждую бутылку', () => {
    const addItem = vi.fn();
    const task = createTask(createPlacesWithCollection(), createTaskFactory({ addItem }));

    plan(task, createNpcState({ inventory: { [Item.Bottles]: 12 } }));

    expect(addItem).toHaveBeenCalledExactlyOnceWith({
      item: Item.Money,
      count: 12 * BOTTLE_PRICE,
    });
  });

  it('Если бутылок ровно на пойло, а денег нет, планирует сдать бутылки', () => {
    const task = createTask(createPlacesWithCollection());

    const names = planNames(
      task,
      createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE } })
    );

    expect(names).not.toBeNull();
  });

  it('Если бутылок не хватает на пойло, а денег нет, план не составляется', () => {
    const task = createTask(createPlacesWithCollection());

    const names = planNames(
      task,
      createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE - 1 } })
    );

    expect(names).toBeNull();
  });

  it('Если бутылок вместе с деньгами хватает на пойло, планирует сдать бутылки', () => {
    const task = createTask(createPlacesWithCollection());
    const state = createNpcState({
      inventory: { [Item.Bottles]: 1, [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE },
    });

    expect(planNames(task, state)).not.toBeNull();
  });

  it('Если бутылок вместе с деньгами не хватает на пойло, план не составляется', () => {
    const task = createTask(createPlacesWithCollection());
    const state = createNpcState({
      inventory: { [Item.Bottles]: 1, [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE - 1 },
    });

    expect(planNames(task, state)).toBeNull();
  });

  it('Если бутылок нет, план не составляется', () => {
    const task = createTask(createPlacesWithCollection());

    expect(planNames(task, createNpcState({ inventory: {} }))).toBeNull();
  });

  it('Если приёмок нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    const names = planNames(
      createTask(places),
      createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE } })
    );

    expect(names).toBeNull();
  });

  it('Спрашивает у places приёмки', () => {
    const places = createMockedPlaces();

    plan(createTask(places), createNpcState({ inventory: { [Item.Bottles]: BOTTLES_FOR_BOOZE } }));

    expect(places.ofType).toHaveBeenCalledWith(PlaceType.BottleCollection);
  });
});
