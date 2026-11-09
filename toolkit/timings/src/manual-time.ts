import { TimeStateValidator } from './time-state-validator';
import type { ITime, TimeState } from './types';

/** Первый день в полночь */
const DEFAULT_STATE: TimeState = {
  day: 1,
  hours: 0,
  minutes: 0,
};

/**
 * Время, которое меняется только через set. Нужно в тестах: время такое, какое нужно тесту. Можно
 * воссоздать из слепка другого времени (см. IReadonlyTime.getState)
 */
export class ManualTime implements ITime {
  private readonly validator = new TimeStateValidator();
  private state: TimeState;

  /**
   * Выбрасывает RangeError, если слепок не момент времени (см. set)
   * @param state - слепок, с которого начинается время. По умолчанию полночь первого дня
   */
  constructor(state: TimeState = DEFAULT_STATE) {
    this.state = DEFAULT_STATE;
    this.set(state);
  }

  get day(): number {
    return this.state.day;
  }

  get hours(): number {
    return this.state.hours;
  }

  get minutes(): number {
    return this.state.minutes;
  }

  getState(): TimeState {
    const { day, hours, minutes } = this.state;

    return {
      day,
      hours,
      minutes,
    };
  }

  clone(): ITime {
    return new ManualTime(this.getState());
  }

  /**
   * Выставляет время.
   * Выбрасывает RangeError, если day не целое от 1, hours не целое от 0 до 23 или minutes не целое
   * от 0 до 59
   * @param state - слепок времени, которое нужно выставить
   */
  set(state: TimeState): void {
    this.validator.validate(state);

    const { day, hours, minutes } = state;

    this.state = {
      day,
      hours,
      minutes,
    };
  }
}
