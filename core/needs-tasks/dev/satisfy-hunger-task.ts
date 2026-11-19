import { ItemClassifier } from '@peetland/inventory';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createPlacesWithShopAndCamp } from '@peetland/places/dev';

import { FoodChooser } from '../src/food-chooser';
import { SatisfyHungerTask } from '../src/satisfy-hunger-task';
import type { SatisfyHungerTaskDeps } from '../src/satisfy-hunger-task';

import { createMockedNeedsTaskFactory } from './factory';

/**
 * Создаёт задачу утолить голод с настоящими зависимостями, если другие не переданы. Фабрика задач
 * удовлетворения потребностей — мок (см. createMockedNeedsTaskFactory). Если места не переданы, в
 * мире есть магазин и бомжарня
 */
export function createSatisfyHungerTask(
  deps: Partial<SatisfyHungerTaskDeps> = {}
): SatisfyHungerTask {
  return new SatisfyHungerTask({
    npcTaskFactory: createNpcTaskFactory(),
    needsTaskFactory: createMockedNeedsTaskFactory(),
    places: createPlacesWithShopAndCamp(),
    foodChooser: new FoodChooser({ itemClassifier: new ItemClassifier() }),
    ...deps,
  });
}
