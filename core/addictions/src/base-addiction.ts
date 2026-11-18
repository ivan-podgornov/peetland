import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import type { Activity } from './activity';
import { AddictionStatus } from './status';
import type { AddictionRecord } from './types';
import type { IAddictionsValidator } from './validator';

/** Зависимость NPC */
export interface IAddiction {
  /** Возвращает значение на момент time */
  get(time: IReadonlyTime): number;
  /** Возвращает статус на момент time */
  getStatus(time: IReadonlyTime): AddictionStatus;
  /** Возвращает значение, момент, когда его выставили, и силу */
  getState(): AddictionRecord;
  /** Возвращает, на сколько занятие изменит значение, без учёта пределов */
  getGain(activity: Activity): number;
  /**
   * Меняет зависимость от занятия
   * @param time - момент, когда занятие закончилось
   */
  perform(activity: Activity, time: IReadonlyTime): void;
}

/**
 * Чем одна зависимость отличается от другой, кроме вклада занятий. Пределы значения и силы и
 * пороги статусов у всех зависимостей одни (см. BaseAddiction)
 */
export type AddictionOptions = Readonly<{
  /**
   * Через сколько игровых минут после употребления тянет при максимальной силе: за это время
   * значение падает от MAX_VALUE до порога срочности
   */
  cravingMinutes: number;
}>;

export type AddictionDeps = {
  validator: IAddictionsValidator;
};

/**
 * Общая логика зависимостей: рост тяги, статус, проверка значения и силы, пределы и изменение от
 * занятий. Значение — насколько NPC не тянет: падает со скоростью, пропорциональной силе, а при силе
 * 0 не падает. Подкласс задаёт скорость при максимальной силе опциями, а вклад занятий — в getGain
 */
export abstract class BaseAddiction implements IAddiction {
  static readonly MIN_VALUE = 0;

  static readonly MAX_VALUE = 100;

  /** Ниже этого значения тянет */
  static readonly URGENT_BELOW = 25;

  /** Выше этого значения не тянет совсем */
  static readonly CALM_ABOVE = 60;

  static readonly MIN_STRENGTH = 0;

  static readonly MAX_STRENGTH = 100;

  private readonly options: AddictionOptions;
  private readonly timeSpan = new TimeSpan();
  private current: AddictionRecord;

  /** @throws ошибку валидатора, если значение или сила не прошли проверку */
  constructor(record: AddictionRecord, options: AddictionOptions, deps: AddictionDeps) {
    const { validator } = deps;

    validator.validateValue(record.value, BaseAddiction.MIN_VALUE, BaseAddiction.MAX_VALUE);
    validator.validateStrength(
      record.strength,
      BaseAddiction.MIN_STRENGTH,
      BaseAddiction.MAX_STRENGTH
    );
    this.options = options;
    this.current = record;
  }

  get(time: IReadonlyTime): number {
    const { value, since, strength } = this.current;
    const { cravingMinutes } = this.options;
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    // При максимальной силе за cravingMinutes значение падает от MAX_VALUE до порога срочности, а
    // при меньшей силе — пропорционально медленнее. Сначала умножаем, чтобы не копить погрешность
    const drop =
      ((BaseAddiction.MAX_VALUE - BaseAddiction.URGENT_BELOW) * strength * elapsed) /
      (cravingMinutes * BaseAddiction.MAX_STRENGTH);

    return Math.max(BaseAddiction.MIN_VALUE, value - drop);
  }

  getStatus(time: IReadonlyTime): AddictionStatus {
    const value = this.get(time);

    if (value < BaseAddiction.URGENT_BELOW) {
      return AddictionStatus.Urgent;
    }

    return value > BaseAddiction.CALM_ABOVE ? AddictionStatus.Calm : AddictionStatus.Moderate;
  }

  getState(): AddictionRecord {
    return this.current;
  }

  abstract getGain(activity: Activity): number;

  /** Прибавляет вклад занятия к значению на момент time и отсчитывает рост тяги от time */
  perform(activity: Activity, time: IReadonlyTime): void {
    this.record = {
      ...this.current,
      value: this.get(time) + this.getGain(activity),
      since: time.getState(),
    };
  }

  protected get record(): AddictionRecord {
    return this.current;
  }

  /** Держит значение в пределах от MIN_VALUE до MAX_VALUE */
  protected set record(record: AddictionRecord) {
    this.current = {
      ...record,
      value: Math.min(BaseAddiction.MAX_VALUE, Math.max(BaseAddiction.MIN_VALUE, record.value)),
    };
  }
}
