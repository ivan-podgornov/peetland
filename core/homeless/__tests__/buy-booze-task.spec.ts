import { createStubTask, plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, BuyBoozeTask } from '../src/buy-booze-task';
import type { BuyBoozeTaskDeps } from '../src/buy-booze-task';

import { createHomelessTaskFactory } from './helpers';

/** Создаёт задачу покупки пойла с настоящими фабриками задач, если другие не переданы */
function createTask(places: IPlaces, deps: Partial<BuyBoozeTaskDeps> = {}): BuyBoozeTask {
  return new BuyBoozeTask({
    npcTaskFactory: createNpcTaskFactory(),
    homelessTaskFactory: createHomelessTaskFactory(),
    places,
    ...deps,
  });
}

/** Создаёт мок мест, в которых есть переданный магазин, и он же ближайший */
function createPlacesWithShop(shop = createPlace()) {
  return createMockedPlaces({
    ofType: vi.fn(() => [shop]),
    findNearest: vi.fn(() => shop),
  });
}

describe('BuyBoozeTask', () => {
  it('Планирует дойти до магазина, повернуться к прилавку и купить пойло', () => {
    const task = createTask(createPlacesWithShop(), {
      homelessTaskFactory: createHomelessTaskFactory({
        purchase: () => createStubTask('purchase'),
      }),
    });

    expect(planNames(task, new NpcStateBuilder().build())).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'purchase',
    ]);
  });

  it('Ищет магазин, ближайший к позиции NPC из состояния', () => {
    const places = createPlacesWithShop();
    const state = new NpcStateBuilder()
      .withPosition({
        x: 8,
        y: 0,
        z: 0,
      })
      .build();

    plan(createTask(places), state);

    expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
      {
        x: 8,
        y: 0,
        z: 0,
      },
      PlaceType.Shop
    );
  });

  it('Идёт к магазину, который вернул places.findNearest', () => {
    const goToCoords = vi.fn();
    const shop = createPlace({
      position: {
        x: 50,
        y: 0,
        z: 0,
      },
    });
    const task = createTask(createPlacesWithShop(shop), {
      npcTaskFactory: createNpcTaskFactory({ goToCoords }),
    });

    plan(task, new NpcStateBuilder().build());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: {
        x: 50,
        y: 0,
        z: 0,
      },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к прилавку магазина, который вернул places.findNearest', () => {
    const achieveAngle = vi.fn();
    const shop = createPlace({ angle: 90 });
    const task = createTask(createPlacesWithShop(shop), {
      npcTaskFactory: createNpcTaskFactory({ achieveAngle }),
    });

    plan(task, new NpcStateBuilder().build());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
      angle: 90,
      tolerance: 15,
    });
  });

  it('Покупает одну бутылку пойла за BOOZE_PRICE', () => {
    const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
    const task = createTask(createPlacesWithShop(), {
      homelessTaskFactory: createHomelessTaskFactory({ purchase }),
    });

    plan(task, new NpcStateBuilder().build());

    expect(purchase).toHaveBeenCalledExactlyOnceWith({
      item: Item.Booze,
      count: 1,
      price: BOOZE_PRICE,
    });
  });

  it('Если магазинов нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    expect(planNames(createTask(places), new NpcStateBuilder().build())).toBeNull();
  });

  it('Спрашивает у places магазины', () => {
    const places = createMockedPlaces();

    plan(createTask(places), new NpcStateBuilder().build());

    expect(places.ofType).toHaveBeenCalledWith(PlaceType.Shop);
  });
});
