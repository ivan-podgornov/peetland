import type { CompoundTask, Method } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';

import { FOOD_PRICES } from './constants';
import type { BuyFoodTaskOptions } from './types';

export type BuyFoodTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
};

/** Купить еду: дойти до магазина, повернуться к прилавку и купить одну штуку по цене из FOOD_PRICES */
export class BuyFoodTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
  private static readonly SHOP_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от прилавка, чтобы купить еду, в градусах */
  private static readonly SHOP_FACING_TOLERANCE = 15;

  readonly name = 'buy-food';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: BuyFoodTaskOptions, deps: BuyFoodTaskDeps) {
    const { food, shop } = options;
    const { npcTaskFactory } = deps;

    this.methods = [
      {
        name: 'go-to-shop',
        preconditions: () => true,
        tasks: [
          npcTaskFactory.goToCoords({
            coords: shop.position,
            completeRadius: BuyFoodTask.SHOP_COMPLETE_RADIUS,
          }),
          npcTaskFactory.achieveAngle({
            angle: shop.angle,
            tolerance: BuyFoodTask.SHOP_FACING_TOLERANCE,
          }),
          npcTaskFactory.purchase({
            item: food,
            count: 1,
            price: FOOD_PRICES[food],
          }),
        ],
      },
    ];
  }
}
