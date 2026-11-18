import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';

import { Activity } from './activity';
import type { PerformedActivity } from './activity';
import { BaseNeed } from './base-need';
import type { NeedDeps, NeedOptions } from './base-need';
import { NeedCategory } from './category';
import type { NeedRecord } from './types';

/** Сытость */
export class Satiety extends BaseNeed {
  static readonly OPTIONS: NeedOptions = {
    category: NeedCategory.Vital,
    // Сутки, а не 8 часов: иначе вся жизнь NPC крутится вокруг еды. Срочно становится за 6 часов
    // до голода (см. BaseNeed.URGENT_BELOW)
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

  getGain(performed: PerformedActivity): number {
    switch (performed.activity) {
      case Activity.Eat:
        return Satiety.FOOD_SATIETY[performed.details.food];
    }

    // Пока все занятия — еда, сюда не дойти. Остальные занятия сытость не меняют
    return 0;
  }
}
