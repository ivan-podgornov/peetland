import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createSellBottlesTask, createPlacesWithCollection, BOTTLES_FOR_BOOZE } from '../../dev';

describe('SellBottlesTask', () => {
  it('Планирует дойти до приёмки, повернуться к приёмщику, отдать бутылки и получить деньги', () => {
    const task = createSellBottlesTask(createPlacesWithCollection());

    const names = planNames(
      task,
      new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build()
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
      .withPosition(8, 0, 0)
      .withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE })
      .build();

    plan(createSellBottlesTask(places), state);

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
    const task = createSellBottlesTask(
      createPlacesWithCollection(collection),
      createNpcTaskFactory({ goToCoords })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build());

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
    const task = createSellBottlesTask(
      createPlacesWithCollection(collection),
      createNpcTaskFactory({ achieveAngle })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
      angle: 90,
      tolerance: 15,
    });
  });

  it('Если приёмок нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    const names = planNames(
      createSellBottlesTask(places),
      new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build()
    );

    expect(names).toBeNull();
  });

  it('Спрашивает у places приёмки', () => {
    const places = createMockedPlaces();

    plan(
      createSellBottlesTask(places),
      new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build()
    );

    expect(places.ofType).toHaveBeenCalledWith(PlaceType.BottleCollection);
  });
});
