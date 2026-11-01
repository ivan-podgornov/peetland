import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';
import { PlaceType } from '../places';
import type { PlaceData } from '../places';

import { AchieveAngleTask } from './achieve-angle-task';
import { GoToCoordsTask } from './go-to-coords-task';
import { PurchaseTask } from './purchase-task';

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
    const { geometry } = this.deps;
    const shop = this.findNearestShop(state.actor.position);

    return [
      new GoToCoordsTask({ coords: shop.position, completeRadius: SHOP_COMPLETE_RADIUS }),
      new AchieveAngleTask({ angle: shop.angle, tolerance: SHOP_FACING_TOLERANCE }, { geometry }),
      new PurchaseTask({ item: Item.Booze, count: 1, price: BOOZE_PRICE }),
    ];
  }

  /**
   * Возвращает магазин, ближайший к позиции. Если ближайших несколько, возвращает первый из них.
   * Вызывается, только если магазины есть
   */
  private findNearestShop(position: Vector3): PlaceData {
    const { geometry } = this.deps;
    const [first, ...rest] = this.shops;

    if (!first) {
      throw new Error('Не из чего выбрать магазин');
    }

    return rest.reduce((nearest, shop) => {
      const distance = geometry.getDistance3d(position, shop.position);
      const nearestDistance = geometry.getDistance3d(position, nearest.position);

      return distance < nearestDistance ? shop : nearest;
    }, first);
  }
}
