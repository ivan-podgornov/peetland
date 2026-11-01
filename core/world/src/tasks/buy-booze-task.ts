import type { IGeometry } from '@peetland/geometry';
import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';
import type { PlaceData } from '../places';

import { AchieveNearestPlaceAngleTask } from './achieve-nearest-place-angle-task';
import { AddItemTask } from './add-item-task';
import { GoToNearestPlaceTask } from './go-to-nearest-place-task';
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

/** Купить пойло в ближайшем магазине. Деньги и пойло меняются, только когда NPC расплатился */
export class BuyBoozeTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'buy-booze';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: BuyBoozeTaskOptions, deps: BuyBoozeTaskDeps) {
    const { shops } = options;

    this.methods = [
      {
        name: 'buy-in-nearest-shop',
        preconditions: () => true,
        tasks: [
          new GoToNearestPlaceTask({ places: shops, completeRadius: SHOP_COMPLETE_RADIUS }, deps),
          new AchieveNearestPlaceAngleTask(
            { places: shops, tolerance: SHOP_FACING_TOLERANCE },
            deps
          ),
          new PlayAnimationTask({ animation: 'pay' }),
          new RemoveItemTask({ item: Item.Money, count: BOOZE_PRICE }),
          new AddItemTask({ item: Item.Booze, count: 1 }),
        ],
      },
    ];
  }
}
