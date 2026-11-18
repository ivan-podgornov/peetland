import { ActivityType } from './activity';
import type { Activity } from './activity';
import { BaseAddiction } from './base-addiction';
import type { AddictionDeps, AddictionOptions } from './base-addiction';
import type { AddictionRecord } from './types';

/** Алкоголизм: зависимость от пойла */
export class Alcoholism extends BaseAddiction {
  /** Алкаша с максимальной силой тянет выпить раз в сутки */
  static readonly OPTIONS: AddictionOptions = { cravingMinutes: 24 * 60 };

  constructor(record: AddictionRecord, deps: AddictionDeps) {
    super(record, Alcoholism.OPTIONS, deps);
  }

  getGain(activity: Activity): number {
    switch (activity.type) {
      case ActivityType.Drink:
        return BaseAddiction.MAX_VALUE;
    }
  }
}
