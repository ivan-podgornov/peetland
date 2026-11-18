/** Проверяет значения и силу зависимостей (см. Addictions) */
export interface IAddictionsValidator {
  /**
   * Выбрасывает RangeError, если value не конечное число от min до max
   * @param value - значение зависимости
   * @param min - минимальное значение
   * @param max - максимальное значение
   */
  validateValue(value: number, min: number, max: number): void;
  /**
   * Выбрасывает RangeError, если strength не конечное число от min до max
   * @param strength - сила зависимости
   * @param min - минимальная сила
   * @param max - максимальная сила
   */
  validateStrength(strength: number, min: number, max: number): void;
}

export class AddictionsValidator implements IAddictionsValidator {
  validateValue(value: number, min: number, max: number): void {
    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(`Зависимость должна быть от ${min} до ${max}, получено ${value}`);
    }
  }

  validateStrength(strength: number, min: number, max: number): void {
    if (!Number.isFinite(strength) || strength < min || strength > max) {
      throw new RangeError(
        `Сила зависимости должна быть от ${min} до ${max}, получено ${strength}`
      );
    }
  }
}
