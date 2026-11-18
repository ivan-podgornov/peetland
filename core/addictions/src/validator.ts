/** Проверяет удовлетворённость и силу зависимостей (см. Addictions) */
export interface IAddictionsValidator {
  /**
   * Выбрасывает RangeError, если satisfaction не конечное число от min до max
   * @param satisfaction - удовлетворённость зависимости
   * @param min - минимальная удовлетворённость
   * @param max - максимальная удовлетворённость
   */
  validateSatisfaction(satisfaction: number, min: number, max: number): void;
  /**
   * Выбрасывает RangeError, если strength не конечное число от min до max
   * @param strength - сила зависимости
   * @param min - минимальная сила
   * @param max - максимальная сила
   */
  validateStrength(strength: number, min: number, max: number): void;
}

export class AddictionsValidator implements IAddictionsValidator {
  validateSatisfaction(satisfaction: number, min: number, max: number): void {
    if (!Number.isFinite(satisfaction) || satisfaction < min || satisfaction > max) {
      throw new RangeError(
        `Удовлетворённость зависимости должна быть от ${min} до ${max}, получено ${satisfaction}`
      );
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
