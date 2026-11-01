import type { IGeometry } from '@peetland/geometry';
import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';
import type { PlaceData } from '../places';

import { BOOZE_PRICE, BuyBoozeTask } from './buy-booze-task';
import { DrinkTask } from './drink-task';

export type RootTaskOptions = {
  /** Магазины, в которых NPC покупают пойло */
  shops: readonly PlaceData[];
};

export type RootTaskDeps = {
  geometry: IGeometry;
};

/**
 * Корневая задача NPC: жить. Методы перечислены по приоритету: есть пойло — бухать, хватает денег —
 * купить пойло
 */
export class RootTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'live';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: RootTaskOptions, deps: RootTaskDeps) {
    this.methods = [
      {
        name: 'drink',
        preconditions: (state) => (state.inventory[Item.Booze] ?? 0) > 0,
        tasks: [new DrinkTask()],
      },
      {
        name: 'buy-booze',
        preconditions: (state) => (state.inventory[Item.Money] ?? 0) >= BOOZE_PRICE,
        tasks: [new BuyBoozeTask({ shops: options.shops }, deps)],
      },
    ];
  }
}
