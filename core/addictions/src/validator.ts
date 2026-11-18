/** Проверяет тягу и силу зависимостей (см. Addictions) */
export interface IAddictionsValidator {
  /**
   * Выбрасывает RangeError, если craving не конечное число от min до max
   * @param craving - тяга
   * @param min - минимальная тяга
   * @param max - максимальная тяга
   */
  validateCraving(craving: number, min: number, max: number): void;
  /**
   * Выбрасывает RangeError, если strength не конечное число от min до max
   * @param strength - сила зависимости
   * @param min - минимальная сила
   * @param max - максимальная сила
   */
  validateStrength(strength: number, min: number, max: number): void;
}

export class AddictionsValidator implements IAddictionsValidator {
  validateCraving(craving: number, min: number, max: number): void {
    if (!Number.isFinite(craving) || craving < min || craving > max) {
      throw new RangeError(`Тяга должна быть от ${min} до ${max}, получено ${craving}`);
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
