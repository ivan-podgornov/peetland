import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';

import { BOOZE_PRICE } from './constants';
import type { BuyBoozeTaskOptions } from './types';

export type BuyBoozeTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
};

/** Купить пойло: дойти до магазина, повернуться к прилавку и купить бутылку за BOOZE_PRICE */
export class BuyBoozeTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
  private static readonly SHOP_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от прилавка, чтобы купить пойло, в градусах */
  private static readonly SHOP_FACING_TOLERANCE = 15;

  readonly name = 'buy-booze';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: BuyBoozeTaskOptions, deps: BuyBoozeTaskDeps) {
    const { shop } = options;
    const { npcTaskFactory } = deps;

    this.methods = [
      {
        name: 'go-to-shop',
        preconditions: () => true,
        tasks: [
          npcTaskFactory.goToCoords({
            coords: shop.position,
            completeRadius: BuyBoozeTask.SHOP_COMPLETE_RADIUS,
          }),
          npcTaskFactory.achieveAngle({
            angle: shop.angle,
            tolerance: BuyBoozeTask.SHOP_FACING_TOLERANCE,
          }),
          npcTaskFactory.purchase({
            item: Item.Booze,
            count: 1,
            price: BOOZE_PRICE,
          }),
        ],
      },
    ];
  }
}
