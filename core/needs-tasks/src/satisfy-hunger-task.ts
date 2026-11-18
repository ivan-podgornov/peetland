import type { Vector3 } from '@peetland/geometry';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import type { Food } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces, PlaceData } from '@peetland/places';

import type { IFoodChooser } from './food-chooser';
import type { INeedsTaskFactory } from './types';

export type SatisfyHungerTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
  /** Фабрика, которой задача создаёт задачу купить еду */
  needsTaskFactory: INeedsTaskFactory;
  /** Места мира. Еда покупается в магазинах, а съедается в бомжарне */
  places: IPlaces;
  /** Выбирает, что съесть или купить */
  foodChooser: IFoodChooser;
};

/**
 * Утолить голод. Если еда есть, NPC съедает оптимальную. Если еды нет, покупает её в ближайшем
 * магазине и съедает. Что оптимально, решает IFoodChooser по текущей сытости
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
        preconditions: (state) => this.foodFromInventory(state) !== null,
        tasks: (state) => this.eatFromInventory(state),
      },
      {
        name: 'buy-food',
        preconditions: (state) => this.canBuy(state),
        tasks: (state) => this.buyFood(state),
      },
    ];
  }

  private foodFromInventory(state: NpcState): Food | null {
    const { foodChooser } = this.deps;

    return foodChooser.chooseFromInventory(state, this.satiety(state));
  }

  private foodToBuy(state: NpcState): Food | null {
    const { foodChooser } = this.deps;

    return foodChooser.chooseToBuy(state, this.satiety(state));
  }

  private satiety(state: NpcState): number {
    return state.self.needs.get(Need.Satiety, state.world.time);
  }

  /** Купить еду можно, если на неё хватает денег, есть магазин и есть бомжарня, где её съесть */
  private canBuy(state: NpcState): boolean {
    const { places } = this.deps;

    return (
      this.foodToBuy(state) !== null &&
      places.ofType(PlaceType.Shop).length > 0 &&
      places.ofType(PlaceType.HomelessCamp).length > 0
    );
  }

  private eatFromInventory(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory } = this.deps;
    const food = this.foodFromInventory(state);

    if (food === null) {
      throw new Error('Еды в инвентаре нет');
    }

    return [npcTaskFactory.eat({ food })];
  }

  private buyFood(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory, needsTaskFactory } = this.deps;
    const food = this.foodToBuy(state);

    if (food === null) {
      throw new Error('Денег на еду нет');
    }

    const shop = this.findNearest(state.self.actor.position, PlaceType.Shop);
    // Есть у дверей магазина не дело, поэтому NPC идёт есть в бомжарню. Когда появится поиск пути,
    // будет есть где-нибудь рядом с магазином
    const camp = this.findNearest(shop.position, PlaceType.HomelessCamp);

    return [
      needsTaskFactory.buyFood({
        food,
        shop,
      }),
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
