import type { CompoundTask, Method, Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';

import { EATING_SATIETY } from './constants';
import type { IFoodChooser } from './food-chooser';
import type { INeedsTaskFactory } from './types';

export type StockFoodTaskDeps = {
  /** Фабрика, которой задача создаёт задачу купить еду */
  needsTaskFactory: INeedsTaskFactory;
  /** Места мира. Еда покупается в магазинах */
  places: IPlaces;
  /** Выбирает, что купить */
  foodChooser: IFoodChooser;
};

/**
 * Обзавестись жратвой: если еды нет, купить её про запас в ближайшем магазине и не есть сразу. Что
 * купить, IFoodChooser выбирает на сытость, при которой NPC её съест (EATING_SATIETY)
 */
export class StockFoodTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'stock-food';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly deps: StockFoodTaskDeps;

  constructor(deps: StockFoodTaskDeps) {
    this.deps = deps;
    this.methods = [
      {
        name: 'buy-food',
        preconditions: (state) => this.canStock(state),
        tasks: (state) => this.buyFood(state),
      },
    ];
  }

  /** Затариться можно, если еды нет, на неё хватает денег и есть магазин */
  private canStock(state: NpcState): boolean {
    const { places, foodChooser } = this.deps;

    return (
      foodChooser.chooseFromInventory(state, EATING_SATIETY) === null &&
      foodChooser.chooseToBuy(state, EATING_SATIETY) !== null &&
      places.ofType(PlaceType.Shop).length > 0
    );
  }

  private buyFood(state: NpcState): Task<NpcState, NpcContext>[] {
    const { needsTaskFactory, places, foodChooser } = this.deps;
    const food = foodChooser.chooseToBuy(state, EATING_SATIETY);
    const shop = places.findNearest(state.self.actor.position, PlaceType.Shop);

    if (food === null || !shop) {
      throw new Error('Купить еду не на что или негде');
    }

    return [
      needsTaskFactory.buyFood({
        food,
        shop,
      }),
    ];
  }
}
