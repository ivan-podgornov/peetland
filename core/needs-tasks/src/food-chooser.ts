import type { Food } from '@peetland/inventory';
import { Activity, Need, Needs } from '@peetland/needs';
import type { NpcState } from '@peetland/npc';

import { FOOD_PRICES } from './constants';

/** Выбирает, что съесть или купить */
export interface IFoodChooser {
  /**
   * Выбирает из еды самую выгодную: ту, что даёт больше всего полезной сытости за доллар по цене из
   * FOOD_PRICES. Полезная — сытость без переедания: сверх максимума не считается. Если выгода
   * равная, выбирает ту, что восполнит больше
   * @param satiety - сытость, при которой NPC съест еду. По умолчанию — текущая
   * @throws если выбирать не из чего
   */
  choose(state: NpcState, foods: readonly Food[], satiety?: number): Food;
}

type FoodValue = {
  /** Сколько сытости восполнит еда без переедания */
  useful: number;
  /** Полезная сытость за доллар */
  perDollar: number;
};

export class FoodChooser implements IFoodChooser {
  choose(
    state: NpcState,
    foods: readonly Food[],
    satiety = state.self.needs.get(Need.Satiety, state.world.time)
  ): Food {
    const [first, ...rest] = foods;

    if (first === undefined) {
      throw new Error('Не из чего выбрать еду');
    }

    return rest.reduce((best, food) => {
      const value = this.value(state, satiety, food);
      const bestValue = this.value(state, satiety, best);
      const better =
        value.perDollar > bestValue.perDollar ||
        (value.perDollar === bestValue.perDollar && value.useful > bestValue.useful);

      return better ? food : best;
    }, first);
  }

  private value(state: NpcState, satiety: number, food: Food): FoodValue {
    const gain = state.self.needs.getGain(Need.Satiety, Activity.Eat, { food });
    const useful = Math.max(0, Math.min(gain, Needs.MAX_NEED - satiety));

    return {
      useful,
      perDollar: useful / FOOD_PRICES[food],
    };
  }
}
