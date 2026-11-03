import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { describe, expect, it, vi } from 'vitest';

import { createCollectBottlesTask, createPlacesWithTrashBins } from '../../dev';
import { MAX_BOTTLES } from '../../src/collect-bottles-task';

describe('CollectBottlesTask', () => {
  it('Планирует дойти до мусорки, повернуться к ней, начать рыться, найти бутылки и перестать рыться', () => {
    const task = createCollectBottlesTask(createPlacesWithTrashBins());
    const state = new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 }).build();

    expect(planNames(task, state)).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'play-animation',
      'parallel',
      'play-animation',
      'add-item',
      'psyche-react',
      'play-animation',
    ]);
  });

  it('Выбирает случайную мусорку из всех мусорок', () => {
    const bins = [
      createPlace({
        id: 'bin-1',
        type: PlaceType.TrashBin,
      }),
      createPlace({
        id: 'bin-2',
        type: PlaceType.TrashBin,
      }),
    ];
    const random = createMockedRandom(false);

    plan(
      createCollectBottlesTask(createPlacesWithTrashBins(bins), createNpcTaskFactory(), random),
      NpcStateBuilder.default()
    );

    expect(random.pick).toHaveBeenCalledExactlyOnceWith(bins);
  });

  it('Идёт к мусорке, которую вернул random.pick', () => {
    const goToCoords = vi.fn();
    const bin = createPlace({
      type: PlaceType.TrashBin,
      position: {
        x: 50,
        y: 0,
        z: 0,
      },
    });
    const random = createMockedRandom(false);
    random.pick.mockReturnValue(bin);
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ goToCoords }),
      random
    );

    plan(task, NpcStateBuilder.default());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: {
        x: 50,
        y: 0,
        z: 0,
      },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается лицом к мусорке, которую вернул random.pick', () => {
    const achieveAngle = vi.fn();
    const bin = createPlace({
      type: PlaceType.TrashBin,
      angle: 90,
    });
    const random = createMockedRandom(false);
    random.pick.mockReturnValue(bin);
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ achieveAngle }),
      random
    );

    plan(task, NpcStateBuilder.default());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
      angle: 90,
      tolerance: 15,
    });
  });

  it('Если мусорок нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    expect(planNames(createCollectBottlesTask(places), NpcStateBuilder.default())).toBeNull();
  });

  it('Спрашивает у places мусорки', () => {
    const places = createMockedPlaces();

    plan(createCollectBottlesTask(places), NpcStateBuilder.default());

    expect(places.ofType).toHaveBeenCalledWith(PlaceType.TrashBin);
  });
});
