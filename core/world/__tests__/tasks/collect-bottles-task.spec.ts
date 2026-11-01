import { Item } from '@peetland/inventory';
import { createMockedRandom } from '@peetland/random/dev';
import { describe, expect, it, vi } from 'vitest';

import {
  BOTTLE_FIND_CHANCE,
  CollectBottlesTask,
  MAX_BOTTLES,
  MAX_BOTTLES_PER_VISIT,
  PlaceType,
} from '../../src';
import type { IPlaces, ITaskFactory } from '../../src';
import { createMockedPlaces } from '../places/helpers';

import { createNpcState, createPlace, createTaskFactory, plan, planNames } from './helpers';

/** Создаёт задачу сбора бутылок с настоящей фабрикой задач, если другая не передана */
function createTask(
  places: IPlaces,
  taskFactory: ITaskFactory = createTaskFactory(),
  random = createMockedRandom(false)
): CollectBottlesTask {
  return new CollectBottlesTask({ places }, { taskFactory, random });
}

/** Создаёт мок мест, в которых есть переданные мусорки */
function createPlacesWithTrashBins(bins = [createPlace({ type: PlaceType.TrashBin })]) {
  return createMockedPlaces({ ofType: vi.fn(() => bins) });
}

describe('CollectBottlesTask', () => {
  it('Планирует дойти до мусорки, повернуться к ней, начать рыться, найти бутылки и перестать рыться', () => {
    const task = createTask(createPlacesWithTrashBins());
    const state = createNpcState({ inventory: { [Item.Bottles]: MAX_BOTTLES - 1 } });

    expect(planNames(task, state)).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'play-animation',
      'try-luck',
      'play-animation',
      'add-item',
      'play-animation',
    ]);
  });

  it('Выбирает случайную мусорку из всех мусорок', () => {
    const bins = [
      createPlace({ id: 'bin-1', type: PlaceType.TrashBin }),
      createPlace({ id: 'bin-2', type: PlaceType.TrashBin }),
    ];
    const random = createMockedRandom(false);

    plan(
      createTask(createPlacesWithTrashBins(bins), createTaskFactory(), random),
      createNpcState()
    );

    expect(random.pick).toHaveBeenCalledExactlyOnceWith(bins);
  });

  it('Идёт к мусорке, которую вернул random.pick', () => {
    const goToCoords = vi.fn();
    const bin = createPlace({ type: PlaceType.TrashBin, position: { x: 50, y: 0, z: 0 } });
    const random = createMockedRandom(false);
    random.pick.mockReturnValue(bin);
    const task = createTask(createPlacesWithTrashBins(), createTaskFactory({ goToCoords }), random);

    plan(task, createNpcState());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к мусорке, которую вернул random.pick', () => {
    const achieveAngle = vi.fn();
    const bin = createPlace({ type: PlaceType.TrashBin, angle: 90 });
    const random = createMockedRandom(false);
    random.pick.mockReturnValue(bin);
    const task = createTask(
      createPlacesWithTrashBins(),
      createTaskFactory({ achieveAngle }),
      random
    );

    plan(task, createNpcState());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({ angle: 90, tolerance: 15 });
  });

  it('Начинает рыться с анимацией trash-search-start, а заканчивает — с trash-search-end', () => {
    const playAnimation = vi.fn();
    const task = createTask(createPlacesWithTrashBins(), createTaskFactory({ playAnimation }));

    plan(task, createNpcState({ inventory: { [Item.Bottles]: MAX_BOTTLES - 1 } }));

    expect(playAnimation.mock.calls).toStrictEqual([
      [{ animation: 'trash-search-start' }],
      [{ animation: 'trash-search-pocket' }],
      [{ animation: 'trash-search-end' }],
    ]);
  });

  it('Ищет каждую бутылку с шансом BOTTLE_FIND_CHANCE', () => {
    const tryLuck = vi.fn();
    const task = createTask(createPlacesWithTrashBins(), createTaskFactory({ tryLuck }));

    plan(task, createNpcState({ inventory: { [Item.Bottles]: MAX_BOTTLES - 1 } }));

    expect(tryLuck).toHaveBeenCalledExactlyOnceWith({ chance: BOTTLE_FIND_CHANCE });
  });

  it('Каждую найденную бутылку кладёт в карман с анимацией trash-search-pocket и добавляет в инвентарь', () => {
    const task = createTask(createPlacesWithTrashBins());
    const state = createNpcState({ inventory: { [Item.Bottles]: MAX_BOTTLES - 2 } });

    const names = planNames(task, state);

    expect(names?.slice(3, -1)).toStrictEqual([
      'try-luck',
      'play-animation',
      'add-item',
      'try-luck',
      'play-animation',
      'add-item',
    ]);
  });

  it('Добавляет по одной бутылке за находку', () => {
    const addItem = vi.fn();
    const task = createTask(createPlacesWithTrashBins(), createTaskFactory({ addItem }));

    plan(task, createNpcState({ inventory: { [Item.Bottles]: MAX_BOTTLES - 1 } }));

    expect(addItem).toHaveBeenCalledExactlyOnceWith({ item: Item.Bottles, count: 1 });
  });

  it('Если NPC унесёт много бутылок, за заход ищет MAX_BOTTLES_PER_VISIT', () => {
    const tryLuck = vi.fn();
    const task = createTask(createPlacesWithTrashBins(), createTaskFactory({ tryLuck }));

    plan(task, createNpcState({ inventory: {} }));

    expect(tryLuck).toHaveBeenCalledTimes(MAX_BOTTLES_PER_VISIT);
  });

  it('Если до MAX_BOTTLES осталось меньше MAX_BOTTLES_PER_VISIT, ищет столько, сколько осталось', () => {
    const tryLuck = vi.fn();
    const task = createTask(createPlacesWithTrashBins(), createTaskFactory({ tryLuck }));

    plan(task, createNpcState({ inventory: { [Item.Bottles]: MAX_BOTTLES - 3 } }));

    expect(tryLuck).toHaveBeenCalledTimes(3);
  });

  it('Если у NPC MAX_BOTTLES бутылок, план не составляется', () => {
    const task = createTask(createPlacesWithTrashBins());

    const names = planNames(task, createNpcState({ inventory: { [Item.Bottles]: MAX_BOTTLES } }));

    expect(names).toBeNull();
  });

  it('Если мусорок нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    expect(planNames(createTask(places), createNpcState())).toBeNull();
  });

  it('Спрашивает у places мусорки', () => {
    const places = createMockedPlaces();

    plan(createTask(places), createNpcState());

    expect(places.ofType).toHaveBeenCalledWith(PlaceType.TrashBin);
  });
});
