import { BaseAddiction } from './base-addiction';
import type { AddictionDeps, AddictionOptions } from './base-addiction';
import { ConsumptionType } from './consumption';
import type { Consumption } from './consumption';
import type { AddictionRecord } from './types';

/** Алкоголизм: зависимость от пойла */
export class Alcoholism extends BaseAddiction {
  /** Алкаша с максимальной силой тянет выпить раз в сутки */
  static readonly OPTIONS: AddictionOptions = { cravingMinutes: 24 * 60 };

  constructor(record: AddictionRecord, deps: AddictionDeps) {
    super(record, Alcoholism.OPTIONS, deps);
  }

  getRelief(consumption: Consumption): number {
    switch (consumption.type) {
      case ConsumptionType.Drink:
        return BaseAddiction.MAX_CRAVING;
    }
  }
}
