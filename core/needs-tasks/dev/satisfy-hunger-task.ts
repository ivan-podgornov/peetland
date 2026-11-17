import { ItemClassifier } from '@peetland/inventory';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createPlace, createPlaces } from '@peetland/places/dev';

import { SatisfyHungerTask } from '../src/satisfy-hunger-task';
import type { SatisfyHungerTaskDeps } from '../src/satisfy-hunger-task';

/** Магазин для тестов: в начале координат, прилавком на 90 градусов */
export const TEST_SHOP = createPlace({
  id: 'shop',
  type: PlaceType.Shop,
  angle: 90,
});

/** Бомжарня для тестов: в 10 метрах от магазина по оси x */
export const TEST_CAMP = createPlace({
  id: 'camp',
  type: PlaceType.HomelessCamp,
  position: {
    x: 10,
    y: 0,
    z: 0,
  },
});

/** Создаёт места с магазином TEST_SHOP и бомжарней TEST_CAMP */
export function createPlacesWithShopAndCamp(): IPlaces {
  return createPlaces([TEST_SHOP, TEST_CAMP]);
}

/**
 * Создаёт задачу утолить голод с настоящими фабрикой задач NPC и классификатором, если другие не
 * переданы. Если места не переданы, в мире есть магазин и бомжарня
 */
export function createSatisfyHungerTask(
  deps: Partial<SatisfyHungerTaskDeps> = {}
): SatisfyHungerTask {
  return new SatisfyHungerTask({
    npcTaskFactory: createNpcTaskFactory(),
    places: createPlacesWithShopAndCamp(),
    itemClassifier: new ItemClassifier(),
    ...deps,
  });
}
