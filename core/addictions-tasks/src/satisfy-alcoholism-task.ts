import type { Vector3 } from '@peetland/geometry';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { Booze, IItemClassifier } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces, PlaceData } from '@peetland/places';

import { BOOZE_PRICE } from './constants';
import type { IAddictionsTaskFactory } from './types';

export type SatisfyAlcoholismTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
  /** Фабрика, которой задача создаёт задачу купить пойло */
  addictionsTaskFactory: IAddictionsTaskFactory;
  /** Места мира. Пойло покупается в магазинах, а пьётся в местах для трапезы */
  places: IPlaces;
  /** Определяет, какие предметы в инвентаре — пойло */
  itemClassifier: IItemClassifier;
};

/**
 * Удовлетворить алкоголизм: выпить пойло в месте для трапезы. Методы в порядке приоритета: если
 * пойло есть и NPC в месте для трапезы, выпить там же; если пойло есть, дойти до ближайшего места
 * для трапезы и выпить; если пойла нет, а денег хватает, купить его в ближайшем магазине, дойти до
 * места для трапезы, ближайшего к магазину, и выпить
 */
export class SatisfyAlcoholismTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от места для трапезы NPC считается в нём, в метрах */
  static readonly SPOT_RADIUS = 3;

  /** На каком расстоянии от места для трапезы можно считать, что NPC до него дошёл, в метрах */
  private static readonly SPOT_COMPLETE_RADIUS = 0.5;

  readonly name = 'satisfy-alcoholism';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly deps: SatisfyAlcoholismTaskDeps;

  constructor(deps: SatisfyAlcoholismTaskDeps) {
    this.deps = deps;
    this.methods = [
      {
        name: 'drink-here',
        preconditions: (state) => this.boozeFromInventory(state) !== null && this.isInSpot(state),
        tasks: (state) => [this.drink(this.requireBooze(state))],
      },
      {
        name: 'go-and-drink',
        preconditions: (state) => this.boozeFromInventory(state) !== null && this.hasSpots(),
        tasks: (state) => [
          this.goToNearestSpot(state.self.actor.position),
          this.drink(this.requireBooze(state)),
        ],
      },
      {
        name: 'buy-and-drink',
        preconditions: (state) => this.canBuy(state),
        tasks: (state) => this.buyAndDrink(state),
      },
    ];
  }

  /** Возвращает пойло из инвентаря NPC или null, если пойла нет */
  private boozeFromInventory(state: NpcState): Booze | null {
    const { itemClassifier } = this.deps;
    const items = Object.keys(state.self.inventory.getAll()) as Item[];

    return items.find((item): item is Booze => itemClassifier.isBooze(item)) ?? null;
  }

  private requireBooze(state: NpcState): Booze {
    const booze = this.boozeFromInventory(state);

    if (booze === null) {
      throw new Error('Пойла в инвентаре нет');
    }

    return booze;
  }

  /** Находится ли NPC в радиусе SPOT_RADIUS от какого-нибудь места для трапезы */
  private isInSpot(state: NpcState): boolean {
    const { places } = this.deps;

    return places.isNear(
      state.self.actor.position,
      PlaceType.MealSpot,
      SatisfyAlcoholismTask.SPOT_RADIUS
    );
  }

  private hasSpots(): boolean {
    const { places } = this.deps;

    return places.ofType(PlaceType.MealSpot).length > 0;
  }

  /** Купить пойло можно, если на него хватает денег, есть магазин и есть место, где его выпить */
  private canBuy(state: NpcState): boolean {
    const { places } = this.deps;

    return (
      state.self.inventory.get(Item.Money) >= BOOZE_PRICE &&
      places.ofType(PlaceType.Shop).length > 0 &&
      this.hasSpots()
    );
  }

  private buyAndDrink(state: NpcState): Task<NpcState, NpcContext>[] {
    const { addictionsTaskFactory } = this.deps;
    const shop = this.findNearest(state.self.actor.position, PlaceType.Shop);

    return [
      addictionsTaskFactory.buyBooze({ shop }),
      this.goToNearestSpot(shop.position),
      this.drink(Item.Booze),
    ];
  }

  private drink(booze: Booze): Task<NpcState, NpcContext> {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.drink({ booze });
  }

  /** Создаёт задачу дойти до места для трапезы, ближайшего к position */
  private goToNearestSpot(position: Vector3): Task<NpcState, NpcContext> {
    const { npcTaskFactory } = this.deps;
    const spot = this.findNearest(position, PlaceType.MealSpot);

    return npcTaskFactory.goToCoords({
      coords: spot.position,
      completeRadius: SatisfyAlcoholismTask.SPOT_COMPLETE_RADIUS,
    });
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
