import type { Food } from '@peetland/inventory';
import { Activity, Need, Needs } from '@peetland/needs';
import type { NpcState } from '@peetland/npc';

/** Выбирает, что съесть */
export interface IFoodChooser {
  /**
   * Выбирает из еды ту, что восполнит сытость до максимума с наименьшим перееданием, а если до
   * максимума не восполнит никакая, — ту, что восполнит больше всего
   * @throws если выбирать не из чего
   */
  choose(state: NpcState, foods: readonly Food[]): Food;
}

export class FoodChooser implements IFoodChooser {
  choose(state: NpcState, foods: readonly Food[]): Food {
    const satiety = state.self.needs.get(Need.Satiety, state.world.time);
    const filling = foods.filter((food) => satiety + this.gain(state, food) >= Needs.MAX_NEED);
    const [first, ...rest] = filling.length > 0 ? filling : foods;

    if (first === undefined) {
      throw new Error('Не из чего выбрать еду');
    }

    return rest.reduce((best, food) => {
      const gain = this.gain(state, food);
      const bestGain = this.gain(state, best);
      const better = filling.length > 0 ? gain < bestGain : gain > bestGain;

      return better ? food : best;
    }, first);
  }

  /** Сколько сытости восполнит еда */
  private gain(state: NpcState, food: Food): number {
    return state.self.needs.getGain(Need.Satiety, Activity.Eat, { food });
  }
}
