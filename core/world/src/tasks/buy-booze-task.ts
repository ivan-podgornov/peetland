import type { IGeometry } from '@peetland/geometry';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';
import { findNearestPlace } from '../places';
import type { PlaceData } from '../places';

import { AchieveAngleTask } from './achieve-angle-task';
import { AddItemTask } from './add-item-task';
import { GoToCoordsTask } from './go-to-coords-task';
import { PlayAnimationTask } from './play-animation-task';
import { RemoveItemTask } from './remove-item-task';

/** Цена бутылки пойла, в долларах */
export const BOOZE_PRICE = 100;

/** На каком расстоянии от магазина можно считать, что NPC до него дошёл, в метрах */
const SHOP_COMPLETE_RADIUS = 0.5;

/** Насколько NPC может быть отвёрнут от прилавка, чтобы купить пойло, в градусах */
const SHOP_FACING_TOLERANCE = 15;

export type BuyBoozeTaskOptions = {
  /** Магазины, в которых можно купить пойло */
  shops: readonly PlaceData[];
};

export type BuyBoozeTaskDeps = {
  geometry: IGeometry;
};

/**
 * Купить пойло в ближайшем магазине. Магазин выбирается при планировании по позиции NPC, один раз
 * на весь план. Деньги и пойло меняются, только когда NPC расплатился
 */
export class BuyBoozeTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'buy-booze';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly options: BuyBoozeTaskOptions;
  private readonly deps: BuyBoozeTaskDeps;

  constructor(options: BuyBoozeTaskOptions, deps: BuyBoozeTaskDeps) {
    this.options = options;
    this.deps = deps;
    this.methods = [
      {
        name: 'buy-in-nearest-shop',
        preconditions: () => this.options.shops.length > 0,
        tasks: (state) => this.buyInNearestShop(state),
      },
    ];
  }

  /** Собирает задачи покупки в магазине, ближайшем к NPC */
  private buyInNearestShop(state: NpcState): Task<NpcState, NpcContext>[] {
    const { shops } = this.options;
    const { geometry } = this.deps;
    const shop = findNearestPlace(shops, state.actor.position, geometry);

    if (!shop) {
      throw new Error('Не из чего выбрать магазин');
    }

    return [
      new GoToCoordsTask({ coords: shop.position, completeRadius: SHOP_COMPLETE_RADIUS }),
      new AchieveAngleTask({ angle: shop.angle, tolerance: SHOP_FACING_TOLERANCE }, { geometry }),
      new PlayAnimationTask({ animation: 'pay' }),
      new RemoveItemTask({ item: Item.Money, count: BOOZE_PRICE }),
      new AddItemTask({ item: Item.Booze, count: 1 }),
    ];
  }
}
