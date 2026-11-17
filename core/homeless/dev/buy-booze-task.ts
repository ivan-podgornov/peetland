import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import type { IPlaces } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { vi } from 'vitest';

import { BuyBoozeTask } from '../src/buy-booze-task';
import type { BuyBoozeTaskDeps } from '../src/buy-booze-task';

/** Создаёт задачу покупки пойла с настоящей фабрикой примитивов, если другая не передана */
export function createBuyBoozeTask(
  places: IPlaces,
  deps: Partial<BuyBoozeTaskDeps> = {}
): BuyBoozeTask {
  return new BuyBoozeTask({
    npcTaskFactory: createNpcTaskFactory(),
    places,
    ...deps,
  });
}

/** Создаёт мок мест, в которых есть переданный магазин, и он же ближайший */
export function createPlacesWithShop(shop = createPlace()) {
  return createMockedPlaces({
    ofType: vi.fn(() => [shop]),
    findNearest: vi.fn(() => shop),
  });
}
