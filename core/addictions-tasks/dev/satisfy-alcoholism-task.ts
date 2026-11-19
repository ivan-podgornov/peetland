import { ItemClassifier } from '@peetland/inventory';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createPlace, createPlaces } from '@peetland/places/dev';

import { SatisfyAlcoholismTask } from '../src/satisfy-alcoholism-task';
import type { SatisfyAlcoholismTaskDeps } from '../src/satisfy-alcoholism-task';

import { createMockedAddictionsTaskFactory } from './factory';

/** Магазин для тестов: в начале координат, прилавком на 90 градусов */
export const TEST_SHOP = createPlace({
  id: 'shop',
  type: PlaceType.Shop,
  angle: 90,
});

/** Место для распития для тестов: в 10 метрах от магазина по оси x */
export const TEST_SPOT = createPlace({
  id: 'spot',
  type: PlaceType.DrinkingSpot,
  position: {
    x: 10,
    y: 0,
    z: 0,
  },
});

/** Создаёт места с магазином TEST_SHOP и местом для распития TEST_SPOT */
export function createPlacesWithShopAndSpot(): IPlaces {
  return createPlaces([TEST_SHOP, TEST_SPOT]);
}

/**
 * Создаёт задачу удовлетворить алкоголизм с настоящими зависимостями, если другие не переданы.
 * Фабрика задач удовлетворения зависимостей — мок (см. createMockedAddictionsTaskFactory). Если места
 * не переданы, в мире есть магазин и место для распития
 */
export function createSatisfyAlcoholismTask(
  deps: Partial<SatisfyAlcoholismTaskDeps> = {}
): SatisfyAlcoholismTask {
  return new SatisfyAlcoholismTask({
    npcTaskFactory: createNpcTaskFactory(),
    addictionsTaskFactory: createMockedAddictionsTaskFactory(),
    places: createPlacesWithShopAndSpot(),
    itemClassifier: new ItemClassifier(),
    ...deps,
  });
}
