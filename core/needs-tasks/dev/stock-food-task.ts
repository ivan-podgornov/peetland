import { ItemClassifier } from '@peetland/inventory';
import { createPlacesWithShopAndMealSpot } from '@peetland/places/dev';

import { FoodChooser } from '../src/food-chooser';
import { StockFoodTask } from '../src/stock-food-task';
import type { StockFoodTaskDeps } from '../src/stock-food-task';

import { createMockedNeedsTaskFactory } from './factory';

/**
 * Создаёт задачу обзавестись жратвой с настоящими зависимостями, если другие не переданы. Фабрика
 * задач удовлетворения потребностей — мок (см. createMockedNeedsTaskFactory). Если места не
 * переданы, в мире есть магазин и место для трапезы
 */
export function createStockFoodTask(deps: Partial<StockFoodTaskDeps> = {}): StockFoodTask {
  return new StockFoodTask({
    needsTaskFactory: createMockedNeedsTaskFactory(),
    places: createPlacesWithShopAndMealSpot(),
    foodChooser: new FoodChooser({ itemClassifier: new ItemClassifier() }),
    ...deps,
  });
}
