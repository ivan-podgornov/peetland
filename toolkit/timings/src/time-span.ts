import { TimeStateValidator } from './time-state-validator';
import type { TimeState } from './types';

/** Считает, сколько игрового времени прошло между двумя моментами, в том числе через полночь */
export class TimeSpan {
  private static readonly MINUTES_PER_HOUR = 60;
  private static readonly MINUTES_PER_DAY = 24 * TimeSpan.MINUTES_PER_HOUR;

  private readonly validator = new TimeStateValidator();

  /**
   * Возвращает, сколько минут прошло от from до to. Если to раньше from, число отрицательное.
   * Выбрасывает RangeError, если from или to не момент времени (см. ITime.set)
   * @param from - слепок начала
   * @param to - слепок конца
   */
  elapsedMinutes(from: TimeState, to: TimeState): number {
    return this.toMinutes(to) - this.toMinutes(from);
  }

  /**
   * Возвращает, прошло ли от from до to не меньше minutes минут.
   * Выбрасывает RangeError, если from или to не момент времени (см. ITime.set)
   * @param from - слепок начала
   * @param to - слепок конца
   * @param minutes - сколько минут должно пройти
   */
  hasPassed(from: TimeState, to: TimeState, minutes: number): boolean {
    return this.elapsedMinutes(from, to) >= minutes;
  }

  /** Переводит момент в минуты от начала первого дня */
  private toMinutes(state: TimeState): number {
    this.validator.validate(state);

    const { day, hours, minutes } = state;

    return (day - 1) * TimeSpan.MINUTES_PER_DAY + hours * TimeSpan.MINUTES_PER_HOUR + minutes;
  }
}
