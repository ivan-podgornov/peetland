import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import type { IReadonlyTime } from '@peetland/timings';

import { Activity } from './activity';
import type { ActivityDetails } from './activity';
import { BaseNeed } from './base-need';
import type { NeedDeps, NeedOptions } from './base-need';
import { NeedCategory } from './category';
import type { NeedRecord } from './types';

/** Сытость */
export class Satiety extends BaseNeed {
  static readonly OPTIONS: NeedOptions = {
    category: NeedCategory.Vital,
    // Сутки, а не 8 часов: иначе вся жизнь NPC крутится вокруг еды
    depletionMinutes: 24 * 60,
    // Срочно за 6 часов до голода
    urgentBelow: 25,
    calmAbove: 60,
  };

  /** Сколько сытости восполняет еда */
  static readonly FOOD_SATIETY: Readonly<Record<Food, number>> = {
    [Item.RomashkaLoaf]: 60,
    [Item.SmilePizza]: 100,
  };

  constructor(record: NeedRecord, deps: NeedDeps) {
    super(record, Satiety.OPTIONS, deps);
  }

  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void {
    switch (activity) {
      case Activity.Eat:
        this.record = {
          value: this.get(time) + Satiety.FOOD_SATIETY[details.food],
          since: time.getState(),
        };
    }
  }
}
