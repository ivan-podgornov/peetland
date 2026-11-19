import { Gauge, GaugeLevel } from '@peetland/gauge';
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
 * Общая логика зависимостей: скорость падения от силы, статус, проверка удовлетворённости и силы и
 * изменение от употребления. Падение и пределы считает шкала (Gauge из @peetland/gauge).
 * Удовлетворённость падает со скоростью, пропорциональной силе, а при силе 0 не падает. Подкласс
 * задаёт скорость при максимальной силе опциями, а вклад употребления — в getGain
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

  /** Статус зависимости на каждом уровне шкалы */
  private static readonly STATUSES: Readonly<Record<GaugeLevel, AddictionStatus>> = {
    [GaugeLevel.Low]: AddictionStatus.Craving,
    [GaugeLevel.Middle]: AddictionStatus.Moderate,
    [GaugeLevel.High]: AddictionStatus.Calm,
  };

  private readonly strength: number;
  private readonly gauge: Gauge;

  /** @throws ошибку валидатора, если удовлетворённость или сила не прошли проверку */
  constructor(record: AddictionRecord, options: AddictionOptions, deps: AddictionDeps) {
    const { validator } = deps;
    const { satisfaction, since, strength } = record;

    validator.validateSatisfaction(
      satisfaction,
      BaseAddiction.MIN_SATISFACTION,
      BaseAddiction.MAX_SATISFACTION
    );
    validator.validateStrength(strength, BaseAddiction.MIN_STRENGTH, BaseAddiction.MAX_STRENGTH);
    this.strength = strength;
    this.gauge = new Gauge(
      {
        value: satisfaction,
        since,
      },
      {
        min: BaseAddiction.MIN_SATISFACTION,
        max: BaseAddiction.MAX_SATISFACTION,
        // При максимальной силе за cravingMinutes удовлетворённость падает от MAX_SATISFACTION до
        // CRAVING_BELOW, а при меньшей силе — пропорционально медленнее
        depletion: {
          amount: (BaseAddiction.MAX_SATISFACTION - BaseAddiction.CRAVING_BELOW) * strength,
          minutes: options.cravingMinutes * BaseAddiction.MAX_STRENGTH,
        },
        lowBelow: BaseAddiction.CRAVING_BELOW,
        highAbove: BaseAddiction.CALM_ABOVE,
      }
    );
  }

  get(time: IReadonlyTime): number {
    return this.gauge.get(time);
  }

  getStatus(time: IReadonlyTime): AddictionStatus {
    return BaseAddiction.STATUSES[this.gauge.getLevel(time)];
  }

  getState(): AddictionRecord {
    const { value, since } = this.gauge.getState();

    return {
      satisfaction: value,
      since,
      strength: this.strength,
    };
  }

  abstract getGain(consumption: Consumption): number;

  /** Прибавляет вклад употребления к удовлетворённости на момент time и отсчитывает падение от time */
  consume(consumption: Consumption, time: IReadonlyTime): void {
    this.gauge.add(this.getGain(consumption), time);
  }
}
