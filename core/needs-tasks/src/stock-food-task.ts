import type { CompoundTask, Method, Task } from '@peetland/htn';
import type { IItemClassifier } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';

import { EATING_SATIETY } from './constants';
import type { IFoodChooser } from './food-chooser';
import { affordableFood, buyFoodTasks, foodInInventory } from './food-shop';

export type StockFoodTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
  /** Места мира. Еда покупается в магазинах */
  places: IPlaces;
  /** Определяет, какие предметы в инвентаре — еда */
  itemClassifier: IItemClassifier;
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
    const { places, itemClassifier } = this.deps;

    return (
      foodInInventory(state, itemClassifier).length === 0 &&
      affordableFood(state).length > 0 &&
      places.ofType(PlaceType.Shop).length > 0
    );
  }

  private buyFood(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory, places, foodChooser } = this.deps;
    const food = foodChooser.choose(state, affordableFood(state), EATING_SATIETY);
    const shop = places.findNearest(state.self.actor.position, PlaceType.Shop);

    if (!shop) {
      throw new Error(`Не из чего выбрать место ${PlaceType.Shop}`);
    }

    return buyFoodTasks(npcTaskFactory, shop, food);
  }
}
