import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import type { Activity } from './activity';
import { NeedStatus } from './status';
import type { NeedRecord } from './types';
import type { INeedsValidator } from './validator';

/** Потребность NPC */
export interface INeed {
  /** Возвращает значение на момент time */
  get(time: IReadonlyTime): number;
  /** Возвращает статус на момент time */
  getStatus(time: IReadonlyTime): NeedStatus;
  /** Возвращает значение и момент, когда его выставили */
  getState(): NeedRecord;
  /** Возвращает, на сколько занятие изменит значение, без учёта пределов */
  getGain(activity: Activity): number;
  /**
   * Меняет потребность от занятия
   * @param time - момент, когда занятие закончилось
   */
  perform(activity: Activity, time: IReadonlyTime): void;
}

/**
 * Чем одна потребность отличается от другой, кроме вклада занятий. Пределы значения и пороги
 * статусов у всех потребностей одни (см. BaseNeed)
 */
export type NeedOptions = Readonly<{
  /** За сколько игровых минут потребность падает от MAX_NEED до MIN_NEED */
  depletionMinutes: number;
}>;

export type NeedDeps = {
  validator: INeedsValidator;
};

/**
 * Общая логика потребностей: падение, статус, проверка значения, пределы и изменение от занятий.
 * Подкласс задаёт скорость падения опциями, а вклад занятий — в getGain
 */
export abstract class BaseNeed implements INeed {
  static readonly MIN_NEED = 0;

  static readonly MAX_NEED = 100;

  /** Ниже этого значения любая потребность срочная */
  static readonly URGENT_BELOW = 25;

  /** Выше этого значения любая потребность спокойная */
  static readonly CALM_ABOVE = 60;

  private readonly options: NeedOptions;
  private readonly timeSpan = new TimeSpan();
  private current: NeedRecord;

  /** @throws ошибку валидатора, если значение не прошло проверку */
  constructor(record: NeedRecord, options: NeedOptions, deps: NeedDeps) {
    const { validator } = deps;

    validator.validateValue(record.value, BaseNeed.MIN_NEED, BaseNeed.MAX_NEED);
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
    const value = this.get(time);

    if (value < BaseNeed.URGENT_BELOW) {
      return NeedStatus.Urgent;
    }

    return value > BaseNeed.CALM_ABOVE ? NeedStatus.Calm : NeedStatus.Moderate;
  }

  getState(): NeedRecord {
    return this.current;
  }

  abstract getGain(activity: Activity): number;

  /** Прибавляет вклад занятия к значению на момент time и отсчитывает падение от time */
  perform(activity: Activity, time: IReadonlyTime): void {
    this.record = {
      value: this.get(time) + this.getGain(activity),
      since: time.getState(),
    };
  }

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
