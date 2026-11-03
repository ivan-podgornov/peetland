import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { vi } from 'vitest';

import { CollectBottlesTask } from '../src/collect-bottles-task';

/** Создаёт задачу сбора бутылок с настоящей фабрикой примитивов, если другая не передана */
export function createCollectBottlesTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory(),
  random = createMockedRandom(false)
): CollectBottlesTask {
  return new CollectBottlesTask({
    npcTaskFactory,
    places,
    random,
  });
}

/** Создаёт мок мест, в которых есть переданные мусорки */
export function createPlacesWithTrashBins(bins = [createPlace({ type: PlaceType.TrashBin })]) {
  return createMockedPlaces({ ofType: vi.fn(() => bins) });
}
