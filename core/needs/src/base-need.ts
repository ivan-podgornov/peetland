import { Gauge, GaugeLevel } from '@peetland/gauge';
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
 * Общая логика потребностей: статус, проверка значения и изменение от занятий. Падение и пределы
 * считает шкала (Gauge из @peetland/gauge). Подкласс задаёт скорость падения опциями, а вклад
 * занятий — в getGain
 */
export abstract class BaseNeed implements INeed {
  static readonly MIN_NEED = 0;

  static readonly MAX_NEED = 100;

  /** Ниже этого значения любая потребность срочная */
  static readonly URGENT_BELOW = 25;

  /** Выше этого значения любая потребность спокойная */
  static readonly CALM_ABOVE = 60;

  /** Статус потребности на каждом уровне шкалы */
  private static readonly STATUSES: Readonly<Record<GaugeLevel, NeedStatus>> = {
    [GaugeLevel.Low]: NeedStatus.Urgent,
    [GaugeLevel.Middle]: NeedStatus.Moderate,
    [GaugeLevel.High]: NeedStatus.Calm,
  };

  private readonly gauge: Gauge;

  /** @throws ошибку валидатора, если значение не прошло проверку */
  constructor(record: NeedRecord, options: NeedOptions, deps: NeedDeps) {
    const { validator } = deps;

    validator.validateValue(record.value, BaseNeed.MIN_NEED, BaseNeed.MAX_NEED);
    this.gauge = new Gauge(record, {
      min: BaseNeed.MIN_NEED,
      max: BaseNeed.MAX_NEED,
      depletion: {
        amount: BaseNeed.MAX_NEED,
        minutes: options.depletionMinutes,
      },
      lowBelow: BaseNeed.URGENT_BELOW,
      highAbove: BaseNeed.CALM_ABOVE,
    });
  }

  get(time: IReadonlyTime): number {
    return this.gauge.get(time);
  }

  getStatus(time: IReadonlyTime): NeedStatus {
    return BaseNeed.STATUSES[this.gauge.getLevel(time)];
  }

  getState(): NeedRecord {
    return this.gauge.getState();
  }

  abstract getGain(activity: Activity): number;

  /** Прибавляет вклад занятия к значению на момент time и отсчитывает падение от time */
  perform(activity: Activity, time: IReadonlyTime): void {
    this.gauge.add(this.getGain(activity), time);
  }
}
