import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';

import { BOOZE_PRICE } from './constants';
import type { IHomelessTaskFactory } from './types';

export type BuyBoozeTaskDeps = {
  /** Места мира. Пойло покупается в местах типа PlaceType.Shop */
  places: IPlaces;
  npcTaskFactory: INpcTaskFactory;
  /** Фабрика, которой создаётся покупка в магазине */
  homelessTaskFactory: IHomelessTaskFactory;
};

/**
 * Купить пойло в ближайшем магазине, если на него хватает денег. Магазин выбирается при планировании по позиции NPC, один раз
 * на весь план
 */
export class BuyBoozeTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
  private static readonly SHOP_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от прилавка, чтобы купить пойло, в градусах */
  private static readonly SHOP_FACING_TOLERANCE = 15;

  readonly name = 'buy-booze';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: BuyBoozeTaskDeps;

  constructor(deps: BuyBoozeTaskDeps) {
    this.places = deps.places;
    this.deps = deps;
    this.methods = [
      {
        name: 'buy-in-nearest-shop',
        preconditions: (state) => this.canBuy(state),
        tasks: (state) => this.buyInNearestShop(state),
      },
    ];
  }

  /** Купить пойло можно, если на него хватает денег и есть магазины */
  private canBuy(state: NpcState): boolean {
    const money = state.self.inventory.get(Item.Money);

    return money >= BOOZE_PRICE && this.places.ofType(PlaceType.Shop).length > 0;
  }

  /** Собирает задачи покупки в магазине, ближайшем к NPC */
  private buyInNearestShop(state: NpcState): Task<NpcState, NpcContext>[] {
    const { homelessTaskFactory, npcTaskFactory } = this.deps;
    const shop = this.places.findNearest(state.self.actor.position, PlaceType.Shop);

    if (!shop) {
      throw new Error('Не из чего выбрать магазин');
    }

    return [
      npcTaskFactory.goToCoords({
        coords: shop.position,
        completeRadius: BuyBoozeTask.SHOP_COMPLETE_RADIUS,
      }),
      npcTaskFactory.achieveAngle({
        angle: shop.angle,
        tolerance: BuyBoozeTask.SHOP_FACING_TOLERANCE,
      }),
      homelessTaskFactory.purchase({
        item: Item.Booze,
        count: 1,
        price: BOOZE_PRICE,
      }),
    ];
  }
}
