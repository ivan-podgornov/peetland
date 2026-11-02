import type { ITime } from './types';

/**
 * Время суток, которое меняется только через set. Нужно в тестах: время такое, какое нужно тесту
 */
export class ManualTime implements ITime {
  private currentHours: number;
  private currentMinutes: number;

  /**
   * Выбрасывает RangeError, если hours или minutes не время суток (см. set)
   * @param hours - час, от 0 до 23
   * @param minutes - минуты, от 0 до 59
   */
  constructor(hours = 0, minutes = 0) {
    this.currentHours = 0;
    this.currentMinutes = 0;
    this.set(hours, minutes);
  }

  get hours(): number {
    return this.currentHours;
  }

  get minutes(): number {
    return this.currentMinutes;
  }

  get minutesSinceMidnight(): number {
    return this.currentHours * 60 + this.currentMinutes;
  }

  /**
   * Выставляет время суток.
   * Выбрасывает RangeError, если hours не целое от 0 до 23 или minutes не целое от 0 до 59
   * @param hours - час, от 0 до 23
   * @param minutes - минуты, от 0 до 59
   */
  set(hours: number, minutes: number): void {
    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
      throw new RangeError('Час должен быть целым числом от 0 до 23');
    }

    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
      throw new RangeError('Минуты должны быть целым числом от 0 до 59');
    }

    this.currentHours = hours;
    this.currentMinutes = minutes;
  }
}
