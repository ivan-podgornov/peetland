/** Проверяет значения потребностей (см. Needs) */
export interface INeedsValidator {
  /**
   * Выбрасывает RangeError, если value не конечное число от min до max
   * @param value - значение потребности
   * @param min - минимальное значение потребности
   * @param max - максимальное значение потребности
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

export class NeedsValidator implements INeedsValidator {
  validateValue(value: number, min: number, max: number): void {
    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(`Потребность должна быть от ${min} до ${max}, получено ${value}`);
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
