import type { FeelingsContribution, IOptimism, ITraitFactory } from '../types';

/** Минимальный оптимизм: пессимист */
export const MIN_OPTIMISM = 0;

/** Максимальный оптимизм: оптимист */
export const MAX_OPTIMISM = 100;

/** Во сколько раз меняется ожидаемое число попыток до удачи на краях оптимизма */
export const OPTIMISM_ATTEMPTS_SPREAD = 1.5;

/**
 * Оптимизм. Решает, сколько попыток персонаж ожидает до удачи, когда планирует. Реалист при
 * среднем оптимизме ожидает 1 / шанс попыток, оптимист — в OPTIMISM_ATTEMPTS_SPREAD раз меньше,
 * пессимист — в OPTIMISM_ATTEMPTS_SPREAD раз больше. Например, при шансе 1/40 — ~27, 40 или 60.
 * Множитель экспоненциальный, как у удачливости: каждый шаг оптимизма меняет ожидание в одинаковое
 * число раз. Оптимизм не меняет сам шанс, а только то, как персонаж его оценивает
 */
export class Optimism implements IOptimism {
  private readonly value: number;

  /**
   * @param value - оптимизм от MIN_OPTIMISM до MAX_OPTIMISM. Если он не конечное число или вне
   * пределов, выбрасывает RangeError
   */
  constructor(value: number) {
    this.assertValue(value);
    this.value = value;
  }

  /** Оптимизм не меняет чувства */
  react(): FeelingsContribution {
    return {};
  }

  /**
   * Ожидание округляется до целого числа попыток. Если шанс не число больше 0 и не больше 1,
   * выбрасывает RangeError
   */
  expectAttempts(chance: number): number {
    if (!(chance > 0 && chance <= 1)) {
      throw new RangeError(`Шанс должен быть числом больше 0 и не больше 1, получено ${chance}`);
    }

    return Math.round((1 / chance) * OPTIMISM_ATTEMPTS_SPREAD ** (1 - this.getShare() * 2));
  }

  /** Возвращает оптимизм долей от 0 до 1 */
  private getShare(): number {
    return (this.value - MIN_OPTIMISM) / (MAX_OPTIMISM - MIN_OPTIMISM);
  }

  private assertValue(value: number): void {
    if (!Number.isFinite(value) || value < MIN_OPTIMISM || value > MAX_OPTIMISM) {
      throw new RangeError(
        `Оптимизм должен быть числом от ${MIN_OPTIMISM} до ${MAX_OPTIMISM}, получено ${value}`
      );
    }
  }
}

export class OptimismFactory implements ITraitFactory<IOptimism> {
  create(value: number): IOptimism {
    return new Optimism(value);
  }
}
