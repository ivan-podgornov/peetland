import { Item } from '@peetland/inventory';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';

import { PurchaseTask } from '../src/purchase-task';
import type { PurchaseTaskOptions } from '../src/purchase-task';

/**
 * Создаёт задачу покупки с настоящей фабрикой примитивов, если другая не передана. Опции, которые не
 * переданы, — одна бутылка пойла за 100 долларов
 */
export function createPurchaseTask(
  options: Partial<PurchaseTaskOptions> = {},
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): PurchaseTask {
  return new PurchaseTask(
    {
      item: Item.Booze,
      count: 1,
      price: 100,
      ...options,
    },
    { npcTaskFactory }
  );
}
