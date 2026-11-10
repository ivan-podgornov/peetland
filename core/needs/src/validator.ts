/** Проверяет значения, из которых потребности считают и восполняют себя (см. Needs) */
export interface INeedsValidator {
  /**
   * Выбрасывает RangeError, если value не конечное число от min до max
   * @param value - значение потребности
   * @param min - минимальное значение потребности
   * @param max - максимальное значение потребности
   */
  validateValue(value: number, min: number, max: number): void;
  /**
   * Выбрасывает RangeError, если minutes не конечное положительное число
   * @param minutes - за сколько минут потребность падает от максимума до минимума
   */
  validateDepletion(minutes: number): void;
  /**
   * Выбрасывает RangeError, если amount не конечное неотрицательное число
   * @param amount - на сколько восполняют потребность
   */
  validateAmount(amount: number): void;
}

export class NeedsValidator implements INeedsValidator {
  validateValue(value: number, min: number, max: number): void {
    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(`Потребность должна быть от ${min} до ${max}, получено ${value}`);
    }
  }

  validateDepletion(minutes: number): void {
    if (!Number.isFinite(minutes) || minutes <= 0) {
      throw new RangeError(
        `Потребность должна падать за конечное положительное число минут, получено ${minutes}`
      );
    }
  }

  validateAmount(amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new RangeError(
        `Восполнение должно быть конечным неотрицательным числом, получено ${amount}`
      );
    }
  }
}
