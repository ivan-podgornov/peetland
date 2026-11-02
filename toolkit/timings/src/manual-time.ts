import type { ITime, TimeState } from './types';

/**
 * Время суток, которое меняется только через set. Нужно в тестах: время такое, какое нужно тесту.
 * Можно воссоздать из слепка другого времени (см. ITime.getState)
 */
const DEFAULT_STATE: TimeState = {
  hours: 0,
  minutes: 0,
};

export class ManualTime implements ITime {
  private currentHours: number;
  private currentMinutes: number;

  /**
   * Выбрасывает RangeError, если в слепке не время суток (см. set)
   * @param state - слепок времени суток, с которого начинается время. По умолчанию полночь
   */
  constructor(state: TimeState = DEFAULT_STATE) {
    this.currentHours = 0;
    this.currentMinutes = 0;
    this.set(state.hours, state.minutes);
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

  getState(): TimeState {
    return {
      hours: this.currentHours,
      minutes: this.currentMinutes,
    };
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
