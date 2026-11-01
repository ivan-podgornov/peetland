import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

import type { ITaskFactory } from './task-factory';

export type PurchaseTaskOptions = {
  /** Какой предмет купить */
  item: Exclude<Item, Item.Money>;
  /** Сколько предмета купить */
  count: number;
  /** Сколько заплатить, в долларах */
  price: number;
};

export type PurchaseTaskDeps = {
  taskFactory: ITaskFactory;
};

/**
 * Купить предмет там, где NPC стоит: заплатить и получить предмет. Деньги и предмет меняются, только
 * когда NPC расплатился. Купить можно, только если денег хватает
 */
export class PurchaseTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'purchase';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: PurchaseTaskOptions, deps: PurchaseTaskDeps) {
    const { item, count, price } = options;
    const { taskFactory } = deps;

    this.methods = [
      {
        name: 'pay',
        preconditions: (state) => (state.inventory[Item.Money] ?? 0) >= price,
        tasks: [
          taskFactory.playAnimation({ animation: 'pay' }),
          taskFactory.removeItem({ item: Item.Money, count: price }),
          taskFactory.addItem({ item, count }),
        ],
      },
    ];
  }
}
