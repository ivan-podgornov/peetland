import type { TimeState } from './types';

/** Проверяет, что слепок — момент времени: день, час и минуты в своих пределах */
export class TimeStateValidator {
  /**
   * Выбрасывает RangeError, если day не целое от 1, hours не целое от 0 до 23 или minutes не целое
   * от 0 до 59
   * @param state - слепок, который нужно проверить
   */
  validate(state: TimeState): void {
    const { day, hours, minutes } = state;

    if (!Number.isInteger(day) || day < 1) {
      throw new RangeError('День должен быть целым числом от 1');
    }

    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
      throw new RangeError('Час должен быть целым числом от 0 до 23');
    }

    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
      throw new RangeError('Минуты должны быть целым числом от 0 до 59');
    }
  }
}
