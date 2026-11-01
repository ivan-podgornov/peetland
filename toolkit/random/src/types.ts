export interface IRandom {
  /**
   * Бросает шанс: возвращает true с вероятностью probability
   * @param probability - вероятность успеха от 0 (никогда) до 1 (всегда), например, 1 / 60
   */
  chance(probability: number): boolean;

  /**
   * Возвращает случайный элемент списка. У каждого элемента одинаковый шанс
   * @param items - из чего выбирать. Список не должен быть пустым
   */
  pick<T>(items: readonly T[]): T;
}
