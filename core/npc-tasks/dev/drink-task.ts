import { Item } from '@peetland/inventory';

import type { DrinkTaskOptions, INpcTaskFactory } from '../src';
import { DrinkTask } from '../src/drink-task';

import { createNpcTaskFactory } from './factory';

/** Создаёт задачу выпить пойло с настоящей фабрикой примитивов, если другие не переданы */
export function createDrinkTask(
  options: Partial<DrinkTaskOptions> = {},
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): DrinkTask {
  return new DrinkTask(
    {
      booze: Item.Booze,
      ...options,
    },
    { npcTaskFactory }
  );
}
