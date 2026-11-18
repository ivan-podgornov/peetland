import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import type { Consumption } from './consumption';
import { AddictionStatus } from './status';
import type { AddictionRecord } from './types';
import type { IAddictionsValidator } from './validator';

/** Зависимость NPC */
export interface IAddiction {
  /** Возвращает удовлетворённость на момент time */
  get(time: IReadonlyTime): number;
  /** Возвращает статус на момент time */
  getStatus(time: IReadonlyTime): AddictionStatus;
  /** Возвращает удовлетворённость, момент, когда её выставили, и силу */
  getState(): AddictionRecord;
  /** Возвращает, на сколько употребление поднимет удовлетворённость, без учёта пределов */
  getGain(consumption: Consumption): number;
  /**
   * Меняет зависимость от употребления
   * @param time - момент, когда NPC закончил употреблять
   */
  consume(consumption: Consumption, time: IReadonlyTime): void;
}

/**
 * Чем одна зависимость отличается от другой, кроме вклада употребления. Пределы удовлетворённости и
 * силы и
 * пороги статусов у всех зависимостей одни (см. BaseAddiction)
 */
export type AddictionOptions = Readonly<{
  /**
   * Через сколько игровых минут после употребления тянет при максимальной силе: за это время
   * удовлетворённость падает от MAX_SATISFACTION до CRAVING_BELOW
   */
  cravingMinutes: number;
}>;

export type AddictionDeps = {
  validator: IAddictionsValidator;
};

/**
 * Общая логика зависимостей: падение удовлетворённости, статус, проверка удовлетворённости и силы,
 * пределы и изменение от употребления. Удовлетворённость падает со скоростью, пропорциональной силе,
 * а при силе 0 не падает. Подкласс задаёт скорость при максимальной силе опциями, а вклад
 * употребления — в getGain
 */
export abstract class BaseAddiction implements IAddiction {
  static readonly MIN_SATISFACTION = 0;

  static readonly MAX_SATISFACTION = 100;

  /** Ниже этой удовлетворённости тянет */
  static readonly CRAVING_BELOW = 25;

  /** Выше этой удовлетворённости NPC спокоен */
  static readonly CALM_ABOVE = 60;

  static readonly MIN_STRENGTH = 0;

  static readonly MAX_STRENGTH = 100;

  private readonly options: AddictionOptions;
  private readonly timeSpan = new TimeSpan();
  private current: AddictionRecord;

  /** @throws ошибку валидатора, если удовлетворённость или сила не прошли проверку */
  constructor(record: AddictionRecord, options: AddictionOptions, deps: AddictionDeps) {
    const { validator } = deps;

    validator.validateSatisfaction(
      record.satisfaction,
      BaseAddiction.MIN_SATISFACTION,
      BaseAddiction.MAX_SATISFACTION
    );
    validator.validateStrength(
      record.strength,
      BaseAddiction.MIN_STRENGTH,
      BaseAddiction.MAX_STRENGTH
    );
    this.options = options;
    this.current = record;
  }

  get(time: IReadonlyTime): number {
    const { satisfaction, since, strength } = this.current;
    const { cravingMinutes } = this.options;
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    // При максимальной силе за cravingMinutes удовлетворённость падает от MAX_SATISFACTION до
    // CRAVING_BELOW, а
    // при меньшей силе — пропорционально медленнее. Сначала умножаем, чтобы не копить погрешность
    const drop =
      ((BaseAddiction.MAX_SATISFACTION - BaseAddiction.CRAVING_BELOW) * strength * elapsed) /
      (cravingMinutes * BaseAddiction.MAX_STRENGTH);

    return Math.max(BaseAddiction.MIN_SATISFACTION, satisfaction - drop);
  }

  getStatus(time: IReadonlyTime): AddictionStatus {
    const satisfaction = this.get(time);

    if (satisfaction < BaseAddiction.CRAVING_BELOW) {
      return AddictionStatus.Craving;
    }

    return satisfaction > BaseAddiction.CALM_ABOVE
      ? AddictionStatus.Calm
      : AddictionStatus.Moderate;
  }

  getState(): AddictionRecord {
    return this.current;
  }

  abstract getGain(consumption: Consumption): number;

  /** Прибавляет вклад употребления к удовлетворённости на момент time и отсчитывает падение от time */
  consume(consumption: Consumption, time: IReadonlyTime): void {
    this.record = {
      ...this.current,
      satisfaction: this.get(time) + this.getGain(consumption),
      since: time.getState(),
    };
  }

  protected get record(): AddictionRecord {
    return this.current;
  }

  /** Держит удовлетворённость в пределах от MIN_SATISFACTION до MAX_SATISFACTION */
  protected set record(record: AddictionRecord) {
    this.current = {
      ...record,
      satisfaction: Math.min(
        BaseAddiction.MAX_SATISFACTION,
        Math.max(BaseAddiction.MIN_SATISFACTION, record.satisfaction)
      ),
    };
  }
}
