import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import type { Activity, ActivityDetails } from './activity';
import type { NeedCategory } from './category';
import { NeedStatus } from './status';
import type { NeedRecord } from './types';
import type { INeedsValidator } from './validator';

/** Потребность NPC */
export interface INeed {
  readonly category: NeedCategory;
  /** Возвращает значение на момент time */
  get(time: IReadonlyTime): number;
  /** Возвращает статус на момент time */
  getStatus(time: IReadonlyTime): NeedStatus;
  /** Возвращает значение и момент, когда его выставили */
  getState(): NeedRecord;
  /** Возвращает, на сколько занятие изменит значение, без учёта пределов */
  getGain<A extends Activity>(activity: A, details: ActivityDetails[A]): number;
  /**
   * Меняет потребность от занятия
   * @param time - момент, когда занятие закончилось
   */
  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void;
}

/** Чем одна потребность отличается от другой */
export type NeedOptions = Readonly<{
  category: NeedCategory;
  /** За сколько игровых минут потребность падает от MAX_NEED до MIN_NEED */
  depletionMinutes: number;
  /** Ниже этого значения потребность срочная */
  urgentBelow: number;
  /** Выше этого значения потребность спокойная */
  calmAbove: number;
}>;

export type NeedDeps = {
  validator: INeedsValidator;
};

/** Общая логика потребностей */
export abstract class BaseNeed implements INeed {
  static readonly MIN_NEED = 0;

  static readonly MAX_NEED = 100;

  readonly category: NeedCategory;

  private readonly options: NeedOptions;
  private readonly timeSpan = new TimeSpan();
  private current: NeedRecord;

  /** @throws ошибку валидатора, если значение не прошло проверку */
  constructor(record: NeedRecord, options: NeedOptions, deps: NeedDeps) {
    const { validator } = deps;

    validator.validateValue(record.value, BaseNeed.MIN_NEED, BaseNeed.MAX_NEED);
    this.category = options.category;
    this.options = options;
    this.current = record;
  }

  get(time: IReadonlyTime): number {
    const { value, since } = this.current;
    const { depletionMinutes } = this.options;
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    const rate = BaseNeed.MAX_NEED / depletionMinutes;

    return Math.max(BaseNeed.MIN_NEED, value - rate * elapsed);
  }

  getStatus(time: IReadonlyTime): NeedStatus {
    const { urgentBelow, calmAbove } = this.options;
    const value = this.get(time);

    if (value < urgentBelow) {
      return NeedStatus.Urgent;
    }

    return value > calmAbove ? NeedStatus.Calm : NeedStatus.Moderate;
  }

  getState(): NeedRecord {
    return this.current;
  }

  abstract getGain<A extends Activity>(activity: A, details: ActivityDetails[A]): number;

  abstract perform<A extends Activity>(
    activity: A,
    details: ActivityDetails[A],
    time: IReadonlyTime
  ): void;

  protected get record(): NeedRecord {
    return this.current;
  }

  /** Держит значение в пределах от MIN_NEED до MAX_NEED */
  protected set record(record: NeedRecord) {
    this.current = {
      value: Math.min(BaseNeed.MAX_NEED, Math.max(BaseNeed.MIN_NEED, record.value)),
      since: record.since,
    };
  }
}
