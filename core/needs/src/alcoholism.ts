import { ActivityType } from './activity';
import type { Activity } from './activity';
import { BaseAddiction } from './base-addiction';
import type { AddictionOptions } from './base-addiction';
import { BaseNeed } from './base-need';
import type { NeedDeps } from './base-need';
import type { AddictionRecord } from './types';

/** Алкоголизм: зависимость от пойла */
export class Alcoholism extends BaseAddiction {
  /** Алкаша с максимальной силой тянет выпить раз в сутки */
  static readonly OPTIONS: AddictionOptions = { cravingMinutes: 24 * 60 };

  constructor(record: AddictionRecord, deps: NeedDeps) {
    super(record, Alcoholism.OPTIONS, deps);
  }

  getGain(activity: Activity): number {
    switch (activity.type) {
      case ActivityType.Drink:
        return BaseNeed.MAX_NEED;
    }

    return 0;
  }
}
