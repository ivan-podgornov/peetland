import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';

import { BOTTLE_PRICE, ENOUGH_MONEY } from './constants';
import type { IHomelessTaskFactory } from './types';

export type HomelessActivityTaskDeps = {
  homelessTaskFactory: IHomelessTaskFactory;
};

/**
 * Деятельность бомжа: перебиваться. Методы перечислены по приоритету: сдать бутылки, а если не
 * получается — попрошайничать, а иначе — собирать бутылки. Если денег хватает, бомж только сдаёт
 * бутылки
 */
export class HomelessActivityTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'scrape-by';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: HomelessActivityTaskDeps) {
    const { homelessTaskFactory } = deps;

    this.methods = [
      {
        name: 'sell-bottles',
        preconditions: () => true,
        tasks: [homelessTaskFactory.sellBottles()],
      },
      {
        name: 'beg',
        preconditions: (state) => !hasEnoughMoney(state),
        tasks: [homelessTaskFactory.beg()],
      },
      {
        name: 'collect-bottles',
        preconditions: (state) => !hasEnoughMoney(state),
        tasks: [homelessTaskFactory.collectBottles()],
      },
    ];
  }
}

/** Хватает ли бомжу денег: деньги вместе с выручкой за бутылки не меньше ENOUGH_MONEY */
function hasEnoughMoney(state: NpcState): boolean {
  const { inventory } = state.self;

  return inventory.get(Item.Money) + inventory.get(Item.Bottles) * BOTTLE_PRICE >= ENOUGH_MONEY;
}
