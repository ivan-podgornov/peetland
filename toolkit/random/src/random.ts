import type { IRandom } from './types';

/** Источник случайных чисел на Math.random */
export class Random implements IRandom {
  /**
   * Выбрасывает RangeError, если probability не число от 0 до 1
   * @inheritdoc
   */
  chance(probability: number): boolean {
    if (!(probability >= 0 && probability <= 1)) {
      throw new RangeError('Вероятность должна быть числом от 0 до 1');
    }

    // Math.random возвращает число из [0, 1), поэтому при 0 шанс не выпадает никогда, а при 1 — всегда
    return Math.random() < probability;
  }

  /**
   * Выбрасывает RangeError, если список пустой
   * @inheritdoc
   */
  pick<T>(items: readonly T[]): T {
    const item = items[Math.floor(Math.random() * items.length)];

    if (item === undefined) {
      throw new RangeError('Нельзя выбрать из пустого списка');
    }

    return item;
  }
}
