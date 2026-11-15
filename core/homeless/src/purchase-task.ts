import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';

export type PurchaseTaskOptions = {
  /** Какой предмет купить */
  item: Exclude<Item, Item.Money>;
  /** Сколько предмета купить */
  count: number;
  /** Сколько заплатить, в долларах */
  price: number;
};

export type PurchaseTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
};

/**
 * Купить предмет там, где NPC стоит: заплатить и получить предмет. Деньги и предмет меняются, только
 * когда NPC расплатился. Купить можно, только если денег хватает. Покупка — транзакция: если NPC
 * заплатил, он не уйдёт без предмета
 */
export class PurchaseTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'purchase';

  readonly transaction = true;

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: PurchaseTaskOptions, deps: PurchaseTaskDeps) {
    const { item, count, price } = options;
    const { npcTaskFactory } = deps;

    this.methods = [
      {
        name: 'pay',
        preconditions: (state) => state.self.inventory.get(Item.Money) >= price,
        tasks: [
          npcTaskFactory.playAnimation({ animation: 'pay' }),
          npcTaskFactory.removeItem({
            item: Item.Money,
            count: price,
          }),
          npcTaskFactory.addItem({
            item,
            count,
          }),
        ],
      },
    ];
  }
}
