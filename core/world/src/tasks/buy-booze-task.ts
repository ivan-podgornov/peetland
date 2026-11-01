import type { IGeometry } from '@peetland/geometry';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';
import { findNearestPlace, PlaceType } from '../places';
import type { PlaceData } from '../places';

import type { ITaskFactory } from './task-factory';

/** Цена бутылки пойла, в долларах */
export const BOOZE_PRICE = 100;

/** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
const SHOP_COMPLETE_RADIUS = 0.5;

/** Насколько NPC может быть отвёрнут от прилавка, чтобы купить пойло, в градусах */
const SHOP_FACING_TOLERANCE = 15;

export type BuyBoozeTaskOptions = {
  /** Места мира. Пойло покупается в местах типа PlaceType.Shop */
  places: readonly PlaceData[];
};

export type BuyBoozeTaskDeps = {
  geometry: IGeometry;
  taskFactory: ITaskFactory;
};

/**
 * Купить пойло в ближайшем магазине. Магазин выбирается при планировании по позиции NPC, один раз
 * на весь план
 */
export class BuyBoozeTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'buy-booze';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly shops: readonly PlaceData[];
  private readonly deps: BuyBoozeTaskDeps;

  constructor(options: BuyBoozeTaskOptions, deps: BuyBoozeTaskDeps) {
    this.shops = options.places.filter((place) => place.type === PlaceType.Shop);
    this.deps = deps;
    this.methods = [
      {
        name: 'buy-in-nearest-shop',
        preconditions: () => this.shops.length > 0,
        tasks: (state) => this.buyInNearestShop(state),
      },
    ];
  }

  /** Собирает задачи покупки в магазине, ближайшем к NPC */
  private buyInNearestShop(state: NpcState): Task<NpcState, NpcContext>[] {
    const { geometry, taskFactory } = this.deps;
    const shop = findNearestPlace(this.shops, state.actor.position, geometry);

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
