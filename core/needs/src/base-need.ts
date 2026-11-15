import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import type { Activity, ActivityDetails } from './activity';
import type { NeedCategory } from './category';
import type { NeedRecord } from './types';
import type { INeedsValidator } from './validator';

/**
 * Одна потребность NPC: хранит значение и момент, когда его выставили, сама падает со временем и
 * сама меняется от занятий. Время передаётся при каждом чтении и записи (см. INeeds)
 */
export interface INeed {
  /** Категория потребности. От неё зависит, какой слой корневой задачи NPC её удовлетворяет */
  readonly category: NeedCategory;
  /** Возвращает значение на момент time */
  get(time: IReadonlyTime): number;
  /** Возвращает, срочная ли потребность на момент time: значение ниже порога срочности */
  isUrgent(time: IReadonlyTime): boolean;
  /** Возвращает, спокойна ли потребность на момент time: значение выше порога спокойствия */
  isCalm(time: IReadonlyTime): boolean;
  /** Возвращает значение и момент, когда его выставили */
  getState(): NeedRecord;
  /**
   * Меняет потребность от занятия: прибавляет вклад занятия к значению на момент time, держит
   * значение в пределах и отсчитывает падение от time. Если занятие потребность не меняет, ничего не
   * делает
   * @param activity - занятие
   * @param details - детали занятия, например что съели
   * @param time - момент, когда занятие закончилось
   */
  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void;
}

/** Считает по деталям занятия, на сколько оно меняет потребность */
export type NeedContributors = Readonly<{
  [A in Activity]?: (details: ActivityDetails[A]) => number;
}>;

export type NeedDeps = {
  /** Проверяет значение потребности */
  validator: INeedsValidator;
};

/**
 * Общая логика потребностей. Значение падает со скоростью MAX_NEED за depletionMinutes игровых
 * минут, не падает ниже MIN_NEED, а если время назад, не растёт. Никто не убавляет потребность по
 * тикам: текущее значение считается при чтении. Чем одна потребность отличается от другой, описывает
 * подкласс: категорию, скорость падения, пороги и вклад занятий
 */
export abstract class BaseNeed implements INeed {
  /** Минимальное значение потребности: потребность не удовлетворена совсем */
  static readonly MIN_NEED = 0;

  /** Максимальное значение потребности: потребность удовлетворена полностью */
  static readonly MAX_NEED = 100;

  abstract readonly category: NeedCategory;

  /** За сколько игровых минут потребность падает от MAX_NEED до MIN_NEED */
  protected abstract readonly depletionMinutes: number;

  /** Ниже этого значения потребность срочная: NPC бросает дела и удовлетворяет её */
  protected abstract readonly urgentBelow: number;

  /**
   * Выше этого значения потребность перестаёт быть срочной. Пока она между порогами, срочность не
   * меняется, поэтому значение, которое скачет около нижнего порога, не поднимает тревогу снова
   */
  protected abstract readonly calmAbove: number;

  /** Вклад занятий. Занятий, которые потребность не меняют, в объекте нет */
  protected abstract readonly contributors: NeedContributors;

  private readonly timeSpan = new TimeSpan();
  private record: NeedRecord;

  /**
   * Проверяет валидатором значение и выбрасывает его ошибку, если проверка не прошла
   * @param record - значение и момент, когда его выставили, например из сохранения
   */
  constructor(record: NeedRecord, deps: NeedDeps) {
    const { validator } = deps;

    validator.validateValue(record.value, BaseNeed.MIN_NEED, BaseNeed.MAX_NEED);
    this.record = record;
  }

  get(time: IReadonlyTime): number {
    const { value, since } = this.record;
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    const rate = BaseNeed.MAX_NEED / this.depletionMinutes;

    return Math.max(BaseNeed.MIN_NEED, value - rate * elapsed);
  }

  isUrgent(time: IReadonlyTime): boolean {
    return this.get(time) < this.urgentBelow;
  }

  isCalm(time: IReadonlyTime): boolean {
    return this.get(time) > this.calmAbove;
  }

  getState(): NeedRecord {
    return this.record;
  }

  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void {
    const contributors: NeedContributors = this.contributors;
    const contributor: NeedContributors[A] = contributors[activity];
    if (contributor === undefined) {
      return;
    }

    this.record = {
      value: this.clamp(this.get(time) + contributor(details)),
      since: time.getState(),
    };
  }

  private clamp(value: number): number {
    return Math.min(BaseNeed.MAX_NEED, Math.max(BaseNeed.MIN_NEED, value));
  }
}
