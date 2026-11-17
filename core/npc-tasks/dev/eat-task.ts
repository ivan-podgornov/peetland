import { Item } from '@peetland/inventory';

import type { EatTaskOptions, INpcTaskFactory } from '../src';
import { EatTask } from '../src/eat-task';

import { createNpcTaskFactory } from './factory';

/** Создаёт задачу съесть пиццу «Смайл» с настоящей фабрикой примитивов, если другие не переданы */
export function createEatTask(
  options: Partial<EatTaskOptions> = {},
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): EatTask {
  return new EatTask(
    {
      food: Item.SmilePizza,
      ...options,
    },
    { npcTaskFactory }
  );
}
