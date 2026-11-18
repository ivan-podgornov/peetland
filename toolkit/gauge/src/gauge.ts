import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import { GaugeLevel } from './level';
import type { GaugeOptions, GaugeState } from './types';

/** Шкала только на чтение */
export interface IReadonlyGauge {
  /** Возвращает значение на момент time */
  get(time: IReadonlyTime): number;
  /** Возвращает уровень значения на момент time */
  getLevel(time: IReadonlyTime): GaugeLevel;
  /** Возвращает значение и момент, когда его выставили. Из него конструктор собирает такую же шкалу */
  getState(): GaugeState;
}

/**
 * Шкала: значение в пределах, которое само падает со временем. Никто не убавляет его по тикам:
 * шкала хранит значение и момент, когда его выставили, а текущее считает при чтении
 */
export class Gauge implements IReadonlyGauge {
  private readonly options: GaugeOptions;
  private readonly timeSpan = new TimeSpan();
  private state: GaugeState;

  /** Значение, которое вышло за пределы, держится в пределах */
  constructor(state: GaugeState, options: GaugeOptions) {
    this.options = options;
    this.state = {
      value: this.clamp(state.value),
      since: state.since,
    };
  }

  /**
   * Возвращает выставленное значение минус падение за время от момента, когда его выставили, до
   * time. Не опускается ниже min, а если time раньше этого момента, не растёт
   */
  get(time: IReadonlyTime): number {
    const { value, since } = this.state;
    const { amount, minutes } = this.options.depletion;
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));

    return this.clamp(value - (amount * elapsed) / minutes);
  }

  getLevel(time: IReadonlyTime): GaugeLevel {
    const { lowBelow, highAbove } = this.options;
    const value = this.get(time);

    if (value < lowBelow) {
      return GaugeLevel.Low;
    }

    return value > highAbove ? GaugeLevel.High : GaugeLevel.Middle;
  }

  getState(): GaugeState {
    return this.state;
  }

  /**
   * Прибавляет amount к значению на момент time и отсчитывает падение от time. Значение держится
   * в пределах
   * @param amount - сколько прибавить, может быть отрицательным
   */
  add(amount: number, time: IReadonlyTime): void {
    this.state = {
      value: this.clamp(this.get(time) + amount),
      since: time.getState(),
    };
  }

  private clamp(value: number): number {
    const { min, max } = this.options;

    return Math.min(max, Math.max(min, value));
  }
}
