import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE } from '../src/buy-booze-task';
import { BOTTLE_PRICE, SellBottlesTask } from '../src/sell-bottles-task';

/** Создаёт задачу сдачи бутылок с настоящей фабрикой примитивов, если другая не передана */
function createTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): SellBottlesTask {
  return new SellBottlesTask({
    npcTaskFactory,
    places,
  });
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
      new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE).build()
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
    const state = new NpcStateBuilder()
      .withPosition({
        x: 8,
        y: 0,
        z: 0,
      })
      .withItem(Item.Bottles, BOTTLES_FOR_BOOZE)
      .build();

    plan(createTask(places), state);

    expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
      {
        x: 8,
        y: 0,
        z: 0,
      },
      PlaceType.BottleCollection
    );
  });

  it('Идёт к приёмке, которую вернул places.findNearest', () => {
    const goToCoords = vi.fn();
    const collection = createPlace({
      type: PlaceType.BottleCollection,
      position: {
        x: 50,
        y: 0,
        z: 0,
      },
    });
    const task = createTask(
      createPlacesWithCollection(collection),
      createNpcTaskFactory({ goToCoords })
    );

    plan(task, new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE).build());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: {
        x: 50,
        y: 0,
        z: 0,
      },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к приёмщику приёмки, которую вернул places.findNearest', () => {
    const achieveAngle = vi.fn();
    const collection = createPlace({
      type: PlaceType.BottleCollection,
      angle: 90,
    });
    const task = createTask(
      createPlacesWithCollection(collection),
      createNpcTaskFactory({ achieveAngle })
    );

    plan(task, new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE).build());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
      angle: 90,
      tolerance: 15,
    });
  });

  it('Отдаёт бутылки с анимацией item-give', () => {
    const playAnimation = vi.fn();
    const task = createTask(createPlacesWithCollection(), createNpcTaskFactory({ playAnimation }));

    plan(task, new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE).build());

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'item-give' });
  });

  it('Отдаёт все бутылки из состояния', () => {
    const removeItem = vi.fn();
    const task = createTask(createPlacesWithCollection(), createNpcTaskFactory({ removeItem }));

    plan(task, new NpcStateBuilder().withItem(Item.Bottles, 12).build());

    expect(removeItem).toHaveBeenCalledExactlyOnceWith({
      item: Item.Bottles,
      count: 12,
    });
  });

  it('Получает BOTTLE_PRICE за каждую бутылку', () => {
    const addItem = vi.fn();
    const task = createTask(createPlacesWithCollection(), createNpcTaskFactory({ addItem }));

    plan(task, new NpcStateBuilder().withItem(Item.Bottles, 12).build());

    expect(addItem).toHaveBeenCalledExactlyOnceWith({
      item: Item.Money,
      count: 12 * BOTTLE_PRICE,
    });
  });

  it('Если бутылок ровно на пойло, а денег нет, планирует сдать бутылки', () => {
    const task = createTask(createPlacesWithCollection());

    const names = planNames(
      task,
      new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE).build()
    );

    expect(names).not.toBeNull();
  });

  it('Если бутылок не хватает на пойло, а денег нет, план не составляется', () => {
    const task = createTask(createPlacesWithCollection());

    const names = planNames(
      task,
      new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE - 1).build()
    );

    expect(names).toBeNull();
  });

  it('Если бутылок вместе с деньгами хватает на пойло, планирует сдать бутылки', () => {
    const task = createTask(createPlacesWithCollection());
    const state = new NpcStateBuilder()
      .withItem(Item.Bottles, 1)
      .withItem(Item.Money, BOOZE_PRICE - BOTTLE_PRICE)
      .build();

    expect(planNames(task, state)).not.toBeNull();
  });

  it('Если бутылок вместе с деньгами не хватает на пойло, план не составляется', () => {
    const task = createTask(createPlacesWithCollection());
    const state = new NpcStateBuilder()
      .withItem(Item.Bottles, 1)
      .withItem(Item.Money, BOOZE_PRICE - BOTTLE_PRICE - 1)
      .build();

    expect(planNames(task, state)).toBeNull();
  });

  it('Если бутылок нет, план не составляется', () => {
    const task = createTask(createPlacesWithCollection());

    expect(planNames(task, new NpcStateBuilder().build())).toBeNull();
  });

  it('Если приёмок нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    const names = planNames(
      createTask(places),
      new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE).build()
    );

    expect(names).toBeNull();
  });

  it('Спрашивает у places приёмки', () => {
    const places = createMockedPlaces();

    plan(
      createTask(places),
      new NpcStateBuilder().withItem(Item.Bottles, BOTTLES_FOR_BOOZE).build()
    );

    expect(places.ofType).toHaveBeenCalledWith(PlaceType.BottleCollection);
  });
});
