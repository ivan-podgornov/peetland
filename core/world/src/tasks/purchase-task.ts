import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

import { AddItemTask } from './add-item-task';
import { PlayAnimationTask } from './play-animation-task';
import { RemoveItemTask } from './remove-item-task';

export type PurchaseTaskOptions = {
  /** Какой предмет купить */
  item: Exclude<Item, Item.Money>;
  /** Сколько предмета купить */
  count: number;
  /** Сколько заплатить, в долларах */
  price: number;
};

/**
 * Купить предмет там, где NPC стоит: заплатить и получить предмет. Деньги и предмет меняются, только
 * когда NPC расплатился. Купить можно, только если денег хватает
 */
export class PurchaseTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'purchase';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: PurchaseTaskOptions) {
    const { item, count, price } = options;

    this.methods = [
      {
        name: 'pay',
        preconditions: (state) => (state.inventory[Item.Money] ?? 0) >= price,
        tasks: [
          new PlayAnimationTask({ animation: 'pay' }),
          new RemoveItemTask({ item: Item.Money, count: price }),
          new AddItemTask({ item, count }),
        ],
      },
    ];
  }
}
