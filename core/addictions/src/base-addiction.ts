import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import type { Consumption } from './consumption';
import { AddictionStatus } from './status';
import type { AddictionRecord } from './types';
import type { IAddictionsValidator } from './validator';

/** Зависимость NPC */
export interface IAddiction {
  /** Возвращает тягу на момент time */
  get(time: IReadonlyTime): number;
  /** Возвращает статус на момент time */
  getStatus(time: IReadonlyTime): AddictionStatus;
  /** Возвращает тягу, момент, когда её выставили, и силу */
  getState(): AddictionRecord;
  /** Возвращает, на сколько употребление снимет тягу, без учёта пределов */
  getRelief(consumption: Consumption): number;
  /**
   * Снимает тягу от употребления
   * @param time - момент, когда NPC закончил употреблять
   */
  consume(consumption: Consumption, time: IReadonlyTime): void;
}

/**
 * Чем одна зависимость отличается от другой, кроме того, как её снимает употребление. Пределы тяги и
 * силы и пороги статусов у всех зависимостей одни (см. BaseAddiction)
 */
export type AddictionOptions = Readonly<{
  /**
   * Через сколько игровых минут после того, как тяга снята, снова тянет при максимальной силе: за
   * это время тяга растёт от MIN_CRAVING до CRAVING_ABOVE
   */
  cravingMinutes: number;
}>;

export type AddictionDeps = {
  validator: IAddictionsValidator;
};

/**
 * Общая логика зависимостей: рост тяги, статус, проверка тяги и силы, пределы и снятие тяги
 * употреблением. Тяга растёт со скоростью, пропорциональной силе, а при силе 0 не растёт. Подкласс
 * задаёт скорость при максимальной силе опциями, а сколько тяги снимает употребление — в getRelief
 */
export abstract class BaseAddiction implements IAddiction {
  static readonly MIN_CRAVING = 0;

  static readonly MAX_CRAVING = 100;

  /** Выше этой тяги тянет */
  static readonly CRAVING_ABOVE = 75;

  /** Ниже этой тяги NPC спокоен */
  static readonly CALM_BELOW = 40;

  static readonly MIN_STRENGTH = 0;

  static readonly MAX_STRENGTH = 100;

  private readonly options: AddictionOptions;
  private readonly timeSpan = new TimeSpan();
  private current: AddictionRecord;

  /** @throws ошибку валидатора, если тяга или сила не прошли проверку */
  constructor(record: AddictionRecord, options: AddictionOptions, deps: AddictionDeps) {
    const { validator } = deps;

    validator.validateCraving(record.craving, BaseAddiction.MIN_CRAVING, BaseAddiction.MAX_CRAVING);
    validator.validateStrength(
      record.strength,
      BaseAddiction.MIN_STRENGTH,
      BaseAddiction.MAX_STRENGTH
    );
    this.options = options;
    this.current = record;
  }

  get(time: IReadonlyTime): number {
    const { craving, since, strength } = this.current;
    const { cravingMinutes } = this.options;
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    // При максимальной силе за cravingMinutes тяга растёт от MIN_CRAVING до CRAVING_ABOVE, а при
    // меньшей силе — пропорционально медленнее. Сначала умножаем, чтобы не копить погрешность
    const growth =
      ((BaseAddiction.CRAVING_ABOVE - BaseAddiction.MIN_CRAVING) * strength * elapsed) /
      (cravingMinutes * BaseAddiction.MAX_STRENGTH);

    return Math.min(BaseAddiction.MAX_CRAVING, craving + growth);
  }

  getStatus(time: IReadonlyTime): AddictionStatus {
    const craving = this.get(time);

    if (craving > BaseAddiction.CRAVING_ABOVE) {
      return AddictionStatus.Craving;
    }

    return craving < BaseAddiction.CALM_BELOW ? AddictionStatus.Calm : AddictionStatus.Moderate;
  }

  getState(): AddictionRecord {
    return this.current;
  }

  abstract getRelief(consumption: Consumption): number;

  /** Снимает с тяги на момент time то, что снимает употребление, и отсчитывает рост тяги от time */
  consume(consumption: Consumption, time: IReadonlyTime): void {
    this.record = {
      ...this.current,
      craving: this.get(time) - this.getRelief(consumption),
      since: time.getState(),
    };
  }

  protected get record(): AddictionRecord {
    return this.current;
  }

  /** Держит тягу в пределах от MIN_CRAVING до MAX_CRAVING */
  protected set record(record: AddictionRecord) {
    this.current = {
      ...record,
      craving: Math.min(
        BaseAddiction.MAX_CRAVING,
        Math.max(BaseAddiction.MIN_CRAVING, record.craving)
      ),
    };
  }
}
