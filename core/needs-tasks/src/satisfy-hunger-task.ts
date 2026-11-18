import type { Vector3 } from '@peetland/geometry';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import type { IItemClassifier } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces, PlaceData } from '@peetland/places';

import type { IFoodChooser } from './food-chooser';
import { affordableFood, buyFoodTasks, foodInInventory } from './food-shop';

export type SatisfyHungerTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
  /** Места мира. Еда покупается в магазинах, а съедается в бомжарне */
  places: IPlaces;
  /** Определяет, какие предметы в инвентаре — еда */
  itemClassifier: IItemClassifier;
  /** Выбирает, что съесть или купить */
  foodChooser: IFoodChooser;
};

/**
 * Утолить голод. Если еда есть, NPC съедает самую выгодную. Если еды нет, покупает её в ближайшем
 * магазине и съедает. Что выгоднее, решает IFoodChooser
 */
export class SatisfyHungerTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от бомжарни можно считать, что NPC до неё дошёл, в метрах */
  private static readonly CAMP_COMPLETE_RADIUS = 0.5;

  readonly name = 'satisfy-hunger';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly deps: SatisfyHungerTaskDeps;

  constructor(deps: SatisfyHungerTaskDeps) {
    this.deps = deps;
    this.methods = [
      {
        name: 'eat-from-inventory',
        preconditions: (state) => foodInInventory(state, deps.itemClassifier).length > 0,
        tasks: (state) => this.eatFromInventory(state),
      },
      {
        name: 'buy-food',
        preconditions: (state) => this.canBuy(state),
        tasks: (state) => this.buyFood(state),
      },
    ];
  }

  /** Купить еду можно, если на неё хватает денег, есть магазин и есть бомжарня, где её съесть */
  private canBuy(state: NpcState): boolean {
    const { places } = this.deps;

    return (
      affordableFood(state).length > 0 &&
      places.ofType(PlaceType.Shop).length > 0 &&
      places.ofType(PlaceType.HomelessCamp).length > 0
    );
  }

  private eatFromInventory(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory, itemClassifier, foodChooser } = this.deps;
    const food = foodChooser.choose(state, foodInInventory(state, itemClassifier));

    return [npcTaskFactory.eat({ food })];
  }

  private buyFood(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory, foodChooser } = this.deps;
    const food = foodChooser.choose(state, affordableFood(state));
    const shop = this.findNearest(state.self.actor.position, PlaceType.Shop);
    // Есть у дверей магазина не дело, поэтому NPC идёт есть в бомжарню. Когда появится поиск пути,
    // будет есть где-нибудь рядом с магазином
    const camp = this.findNearest(shop.position, PlaceType.HomelessCamp);

    return [
      ...buyFoodTasks(npcTaskFactory, shop, food),
      npcTaskFactory.goToCoords({
        coords: camp.position,
        completeRadius: SatisfyHungerTask.CAMP_COMPLETE_RADIUS,
      }),
      npcTaskFactory.eat({ food }),
    ];
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
