import { ItemClassifier } from '@peetland/inventory';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createPlacesWithShopAndSpot } from '@peetland/places/dev';

import { SatisfyAlcoholismTask } from '../src/satisfy-alcoholism-task';
import type { SatisfyAlcoholismTaskDeps } from '../src/satisfy-alcoholism-task';

import { createMockedAddictionsTaskFactory } from './factory';

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
