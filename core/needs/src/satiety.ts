import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';

import { ActivityType } from './activity';
import type { Activity } from './activity';
import { BaseNeed } from './base-need';
import type { NeedDeps, NeedOptions } from './base-need';
import type { NeedRecord } from './types';

/** Сытость */
export class Satiety extends BaseNeed {
  static readonly OPTIONS: NeedOptions = {
    depletionMinutes: 24 * 60,
  };

  /** Сколько сытости восполняет еда */
  static readonly FOOD_SATIETY: Readonly<Record<Food, number>> = {
    [Item.RomashkaLoaf]: 60,
    [Item.SmilePizza]: 100,
  };

  constructor(record: NeedRecord, deps: NeedDeps) {
    super(record, Satiety.OPTIONS, deps);
  }

  getGain(activity: Activity): number {
    switch (activity.type) {
      case ActivityType.Eat:
        return Satiety.FOOD_SATIETY[activity.details.food];
    }

    // Пока все занятия — еда, сюда не дойти. Остальные занятия сытость не меняют
    return 0;
  }
}
