import { ItemClassifier } from '@peetland/inventory';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';

import { FoodChooser } from '../src/food-chooser';
import { StockFoodTask } from '../src/stock-food-task';
import type { StockFoodTaskDeps } from '../src/stock-food-task';

import { createPlacesWithShopAndCamp } from './satisfy-hunger-task';

/**
 * Создаёт задачу обзавестись жратвой с настоящими зависимостями, если другие не переданы. Если
 * места не переданы, в мире есть магазин и бомжарня
 */
export function createStockFoodTask(deps: Partial<StockFoodTaskDeps> = {}): StockFoodTask {
  return new StockFoodTask({
    npcTaskFactory: createNpcTaskFactory(),
    places: createPlacesWithShopAndCamp(),
    itemClassifier: new ItemClassifier(),
    foodChooser: new FoodChooser(),
    ...deps,
  });
}
