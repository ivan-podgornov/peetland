import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';
import { PlaceType } from '../places';
import type { IPlaces } from '../places';

import type { ITaskFactory } from './task-factory';

/** Цена бутылки пойла, в долларах */
export const BOOZE_PRICE = 100;

/** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
const SHOP_COMPLETE_RADIUS = 0.5;

/** Насколько NPC может быть отвёрнут от прилавка, чтобы купить пойло, в градусах */
const SHOP_FACING_TOLERANCE = 15;

export type BuyBoozeTaskOptions = {
  /** Места мира. Пойло покупается в местах типа PlaceType.Shop */
  places: IPlaces;
};

export type BuyBoozeTaskDeps = {
  taskFactory: ITaskFactory;
};

/**
 * Купить пойло в ближайшем магазине. Магазин выбирается при планировании по позиции NPC, один раз
 * на весь план
 */
export class BuyBoozeTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'buy-booze';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: BuyBoozeTaskDeps;

  constructor(options: BuyBoozeTaskOptions, deps: BuyBoozeTaskDeps) {
    this.places = options.places;
    this.deps = deps;
    this.methods = [
      {
        name: 'buy-in-nearest-shop',
        preconditions: () => this.places.ofType(PlaceType.Shop).length > 0,
        tasks: (state) => this.buyInNearestShop(state),
      },
    ];
  }

  /** Собирает задачи покупки в магазине, ближайшем к NPC */
  private buyInNearestShop(state: NpcState): Task<NpcState, NpcContext>[] {
    const { taskFactory } = this.deps;
    const shop = this.places.findNearest(state.actor.position, PlaceType.Shop);

    if (!shop) {
      throw new Error('Не из чего выбрать магазин');
    }

    return [
      taskFactory.goToCoords({ coords: shop.position, completeRadius: SHOP_COMPLETE_RADIUS }),
      taskFactory.achieveAngle({ angle: shop.angle, tolerance: SHOP_FACING_TOLERANCE }),
      taskFactory.purchase({ item: Item.Booze, count: 1, price: BOOZE_PRICE }),
    ];
  }
}
