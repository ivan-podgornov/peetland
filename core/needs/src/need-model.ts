import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import type { Activity, ActivityDetails } from './activity';
import type { NeedCategory } from './category';
import type { NeedRecord } from './types';

/**
 * Модель потребности: как одна потребность падает, когда она срочная и как её меняют занятия. Модель
 * не хранит значение: она считает по записи потребности (NeedRecord), которую хранят потребности
 * (см. Needs)
 */
export interface INeedModel {
  /** Категория потребности. От неё зависит, какой слой корневой задачи NPC её удовлетворяет */
  readonly category: NeedCategory;
  /** Ниже этого значения потребность срочная: NPC бросает дела и удовлетворяет её */
  readonly urgentBelow: number;
  /**
   * Выше этого значения потребность перестаёт быть срочной. Пока она между порогами, срочность не
   * меняется, поэтому значение, которое скачет около нижнего порога, не поднимает тревогу снова
   */
  readonly calmAbove: number;
  /**
   * Возвращает значение потребности на момент time
   * @param record - запись потребности
   * @param time - время, на момент которого нужно значение
   */
  get(record: NeedRecord, time: IReadonlyTime): number;
  /** Возвращает, ниже ли значение на момент time порога urgentBelow */
  isUrgent(record: NeedRecord, time: IReadonlyTime): boolean;
  /** Возвращает, выше ли значение на момент time порога calmAbove */
  isCalm(record: NeedRecord, time: IReadonlyTime): boolean;
  /**
   * Возвращает запись потребности после занятия: вклад занятия прибавлен к значению на момент time,
   * значение в пределах, а падение отсчитывается от time. Если занятие потребность не меняет,
   * возвращает ту же запись
   * @param record - запись потребности до занятия
   * @param activity - занятие
   * @param details - детали занятия, например что съели
   * @param time - момент, когда занятие закончилось
   */
  perform<A extends Activity>(
    record: NeedRecord,
    activity: A,
    details: ActivityDetails[A],
    time: IReadonlyTime
  ): NeedRecord;
}

/** Считает по деталям занятия, на сколько оно меняет потребность */
export type NeedContributors = Readonly<{
  [A in Activity]?: (details: ActivityDetails[A]) => number;
}>;

/**
 * Общая логика моделей потребностей. Значение падает со скоростью MAX_NEED за depletionMinutes
 * игровых минут, не падает ниже MIN_NEED, а если время назад, не растёт. Что отличает одну
 * потребность от другой, описывает подкласс: категорию, скорость падения, пороги и вклад занятий
 */
export abstract class NeedModel implements INeedModel {
  /** Минимальное значение потребности: потребность не удовлетворена совсем */
  static readonly MIN_NEED = 0;

  /** Максимальное значение потребности: потребность удовлетворена полностью */
  static readonly MAX_NEED = 100;

  abstract readonly category: NeedCategory;
  abstract readonly urgentBelow: number;
  abstract readonly calmAbove: number;

  /** За сколько игровых минут потребность падает от MAX_NEED до MIN_NEED */
  protected abstract readonly depletionMinutes: number;

  /** Вклад занятий. Занятий, которые потребность не меняют, в объекте нет */
  protected abstract readonly contributors: NeedContributors;

  private readonly timeSpan = new TimeSpan();

  get(record: NeedRecord, time: IReadonlyTime): number {
    const { value, since } = record;
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    const rate = NeedModel.MAX_NEED / this.depletionMinutes;

    return Math.max(NeedModel.MIN_NEED, value - rate * elapsed);
  }

  isUrgent(record: NeedRecord, time: IReadonlyTime): boolean {
    return this.get(record, time) < this.urgentBelow;
  }

  isCalm(record: NeedRecord, time: IReadonlyTime): boolean {
    return this.get(record, time) > this.calmAbove;
  }

  perform<A extends Activity>(
    record: NeedRecord,
    activity: A,
    details: ActivityDetails[A],
    time: IReadonlyTime
  ): NeedRecord {
    const contributors: NeedContributors = this.contributors;
    const contributor: NeedContributors[A] = contributors[activity];
    if (contributor === undefined) {
      return record;
    }

    return {
      value: this.clamp(this.get(record, time) + contributor(details)),
      since: time.getState(),
    };
  }

  private clamp(value: number): number {
    return Math.min(NeedModel.MAX_NEED, Math.max(NeedModel.MIN_NEED, value));
  }
}
