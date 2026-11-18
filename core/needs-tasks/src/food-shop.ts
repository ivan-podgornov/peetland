import type { Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { Food, IItemClassifier } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { PlaceData } from '@peetland/places';

import { FOOD_PRICES } from './constants';

/** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
const SHOP_COMPLETE_RADIUS = 0.5;

/** Насколько NPC может быть отвёрнут от прилавка, чтобы купить еду, в градусах */
const SHOP_FACING_TOLERANCE = 15;

/** Еда, которая продаётся в магазине */
const SHOP_FOOD = Object.keys(FOOD_PRICES) as Food[];

/** Еда в инвентаре NPC */
export function foodInInventory(state: NpcState, itemClassifier: IItemClassifier): Food[] {
  const items = Object.keys(state.self.inventory.getAll()) as Item[];

  return items.filter((item): item is Food => itemClassifier.isFood(item));
}

/** Еда из магазина, на которую NPC хватает денег */
export function affordableFood(state: NpcState): Food[] {
  const money = state.self.inventory.get(Item.Money);

  return SHOP_FOOD.filter((food) => FOOD_PRICES[food] <= money);
}

/** Задачи дойти до магазина, повернуться к прилавку и купить одну штуку еды по её цене */
export function buyFoodTasks(
  npcTaskFactory: INpcTaskFactory,
  shop: PlaceData,
  food: Food
): Task<NpcState, NpcContext>[] {
  return [
    npcTaskFactory.goToCoords({
      coords: shop.position,
      completeRadius: SHOP_COMPLETE_RADIUS,
    }),
    npcTaskFactory.achieveAngle({
      angle: shop.angle,
      tolerance: SHOP_FACING_TOLERANCE,
    }),
    npcTaskFactory.purchase({
      item: food,
      count: 1,
      price: FOOD_PRICES[food],
    }),
  ];
}
