import { Item } from '@peetland/inventory';
import type { Food, IItemClassifier } from '@peetland/inventory';
import { ActivityType, Need, Needs } from '@peetland/needs';
import type { NpcState } from '@peetland/npc';

import { FOOD_PRICES } from './constants';

/**
 * Выбирает оптимальную еду: ту, у которой лучше соотношение питательности и цены из FOOD_PRICES.
 * Питательность считается от сытости, при которой NPC съест еду: то, что не влезет сверх максимума
 * сытости, не считается. Если соотношение одинаковое, выбирает ту, что питательнее
 */
export interface IFoodChooser {
  /**
   * Выбирает оптимальную еду из инвентаря NPC
   * @param satiety - сытость, при которой NPC съест еду
   * @returns null, если еды в инвентаре нет
   */
  chooseFromInventory(state: NpcState, satiety: number): Food | null;
  /**
   * Выбирает оптимальную еду из магазина, на которую NPC хватает денег
   * @param satiety - сытость, при которой NPC съест еду
   * @returns null, если денег не хватает ни на какую еду
   */
  chooseToBuy(state: NpcState, satiety: number): Food | null;
}

export type FoodChooserDeps = {
  /** Определяет, какие предметы в инвентаре — еда */
  itemClassifier: IItemClassifier;
};

export class FoodChooser implements IFoodChooser {
  /** Еда, которая продаётся в магазине */
  private static readonly SHOP_FOOD = Object.keys(FOOD_PRICES) as Food[];

  private readonly itemClassifier: IItemClassifier;

  constructor(deps: FoodChooserDeps) {
    this.itemClassifier = deps.itemClassifier;
  }

  chooseFromInventory(state: NpcState, satiety: number): Food | null {
    const items = Object.keys(state.self.inventory.getAll()) as Item[];
    const foods = items.filter((item): item is Food => this.itemClassifier.isFood(item));

    return this.chooseOptimal(state, satiety, foods);
  }

  chooseToBuy(state: NpcState, satiety: number): Food | null {
    const money = state.self.inventory.get(Item.Money);
    const foods = FoodChooser.SHOP_FOOD.filter((food) => FOOD_PRICES[food] <= money);

    return this.chooseOptimal(state, satiety, foods);
  }

  private chooseOptimal(state: NpcState, satiety: number, foods: readonly Food[]): Food | null {
    const [first, ...rest] = foods;

    if (first === undefined) {
      return null;
    }

    return rest.reduce((best, food) => {
      const nutrition = this.nutritionWithoutOvereating(state, satiety, food);
      const bestNutrition = this.nutritionWithoutOvereating(state, satiety, best);
      const perDollar = nutrition / FOOD_PRICES[food];
      const bestPerDollar = bestNutrition / FOOD_PRICES[best];
      const better =
        perDollar > bestPerDollar || (perDollar === bestPerDollar && nutrition > bestNutrition);

      return better ? food : best;
    }, first);
  }

  /** Сколько сытости восполнит еда, если съесть её при сытости satiety, без того, что не влезет */
  private nutritionWithoutOvereating(state: NpcState, satiety: number, food: Food): number {
    const gain = state.self.needs.getGain(Need.Satiety, {
      type: ActivityType.Eat,
      details: { food },
    });

    return Math.max(0, Math.min(gain, Needs.MAX_NEED - satiety));
  }
}
