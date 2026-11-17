import type { Vector3 } from '@peetland/geometry';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { Food, IItemClassifier } from '@peetland/inventory';
import { Activity, Need, Needs } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces, PlaceData } from '@peetland/places';

import { FOOD_PRICES } from './constants';

export type SatisfyHungerTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
  /** Места мира. Еда покупается в магазинах, а съедается в бомжарне */
  places: IPlaces;
  /** Определяет, какие предметы — еда */
  itemClassifier: IItemClassifier;
};

/**
 * Утолить голод. Если еда есть, NPC съедает ту, что лучше всего подходит. Если еды нет, покупает её в
 * ближайшем магазине и съедает. Лучше всего подходит еда, которая восполнит сытость до максимума с
 * наименьшим перееданием, а если до максимума не восполнит никакая, — та, что восполнит больше всего
 */
export class SatisfyHungerTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
  private static readonly SHOP_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от прилавка, чтобы купить еду, в градусах */
  private static readonly SHOP_FACING_TOLERANCE = 15;

  /** На каком расстоянии от бомжарни можно считать, что NPC до неё дошёл, в метрах */
  private static readonly CAMP_COMPLETE_RADIUS = 0.5;

  readonly name = 'satisfy-hunger';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly deps: SatisfyHungerTaskDeps;
  private readonly foods: readonly Food[];

  constructor(deps: SatisfyHungerTaskDeps) {
    const { itemClassifier } = deps;

    this.deps = deps;
    this.foods = Object.values(Item).filter((item): item is Food => itemClassifier.isFood(item));
    this.methods = [
      {
        name: 'eat-from-inventory',
        preconditions: (state) => this.foodInInventory(state).length > 0,
        tasks: (state) => this.eatFromInventory(state),
      },
      {
        name: 'buy-food',
        preconditions: (state) => this.canBuy(state),
        tasks: (state) => this.buyFood(state),
      },
    ];
  }

  private foodInInventory(state: NpcState): Food[] {
    return this.foods.filter((food) => state.self.inventory.has(food));
  }

  private affordableFood(state: NpcState): Food[] {
    const money = state.self.inventory.get(Item.Money);

    return this.foods.filter((food) => FOOD_PRICES[food] <= money);
  }

  /** Купить еду можно, если на неё хватает денег, есть магазин и есть бомжарня, где её съесть */
  private canBuy(state: NpcState): boolean {
    const { places } = this.deps;

    return (
      this.affordableFood(state).length > 0 &&
      places.ofType(PlaceType.Shop).length > 0 &&
      places.ofType(PlaceType.HomelessCamp).length > 0
    );
  }

  private eatFromInventory(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory } = this.deps;

    return [npcTaskFactory.eat({ food: this.choose(state, this.foodInInventory(state)) })];
  }

  private buyFood(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory } = this.deps;
    const food = this.choose(state, this.affordableFood(state));
    const shop = this.findNearest(state.self.actor.position, PlaceType.Shop);
    // Есть у дверей магазина не дело, поэтому NPC идёт есть в бомжарню. Когда появится поиск пути,
    // будет есть где-нибудь рядом с магазином
    const camp = this.findNearest(shop.position, PlaceType.HomelessCamp);

    return [
      npcTaskFactory.goToCoords({
        coords: shop.position,
        completeRadius: SatisfyHungerTask.SHOP_COMPLETE_RADIUS,
      }),
      npcTaskFactory.achieveAngle({
        angle: shop.angle,
        tolerance: SatisfyHungerTask.SHOP_FACING_TOLERANCE,
      }),
      npcTaskFactory.purchase({
        item: food,
        count: 1,
        price: FOOD_PRICES[food],
      }),
      npcTaskFactory.goToCoords({
        coords: camp.position,
        completeRadius: SatisfyHungerTask.CAMP_COMPLETE_RADIUS,
      }),
      npcTaskFactory.eat({ food }),
    ];
  }

  /** Выбирает из еды ту, что лучше всего подходит (см. SatisfyHungerTask) */
  private choose(state: NpcState, foods: readonly Food[]): Food {
    const satiety = state.self.needs.get(Need.Satiety, state.world.time);
    const filling = foods.filter((food) => satiety + this.gain(state, food) >= Needs.MAX_NEED);
    const [first, ...rest] = filling.length > 0 ? filling : foods;

    if (first === undefined) {
      throw new Error('Не из чего выбрать еду');
    }

    return rest.reduce((best, food) => {
      const gain = this.gain(state, food);
      const bestGain = this.gain(state, best);
      // Из того, что добивает до максимума, лучше то, что меньше переедает, а иначе — то, что
      // восполняет больше
      const better = filling.length > 0 ? gain < bestGain : gain > bestGain;

      return better ? food : best;
    }, first);
  }

  /** Сколько сытости восполнит еда */
  private gain(state: NpcState, food: Food): number {
    return state.self.needs.getGain(Need.Satiety, Activity.Eat, { food });
  }

  private findNearest(position: Vector3, type: PlaceType): PlaceData {
    const { places } = this.deps;
    const place = places.findNearest(position, type);

    if (!place) {
      throw new Error(`Не из чего выбрать место ${type}`);
    }

    return place;
  }
}
