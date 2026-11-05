import type { FeelingsContribution, ILuck, ITraitFactory } from '../types';

/**
 * Удачливость. Меняет шанс, с которым персонажу везёт в игре: при средней удачливости шанс как есть,
 * а на краях соотношение удач и неудач, шанс / (1 − шанс), в Luck.CHANCE_SPREAD раз ниже или выше.
 *
 * Умножается соотношение, а не сам шанс, чтобы большой шанс не выходил за 1: 0.8 × 1.5 = 1.2, а с
 * соотношением 0.8 становится ~0.86. На малых шансах соотношение почти равно шансу: 1/40 становится
 * ~1/27. Множитель экспоненциальный, потому что шанс меняется «в разах»: так каждый шаг удачливости
 * меняет его в одинаковое число раз, а нижний край душит шанс не сильнее, чем верхний поднимает
 */
export class Luck implements ILuck {
  /** Минимальная удачливость */
  static readonly MIN = 0;

  /** Максимальная удачливость */
  static readonly MAX = 100;

  /** Во сколько раз меняется соотношение удач и неудач на краях удачливости */
  static readonly CHANCE_SPREAD = 1.5;

  private readonly value: number;

  /**
   * @param value - удачливость от Luck.MIN до Luck.MAX. Если она не конечное число или вне
   * пределов, выбрасывает RangeError
   */
  constructor(value: number) {
    this.assertValue(value);
    this.value = value;
  }

  /** Удачливость не меняет чувства */
  react(): FeelingsContribution {
    return {};
  }

  /** Шанс 1 — гарантированная удача, удачливость его не меняет */
  adjustChance(chance: number): number {
    if (chance === 1) {
      return 1;
    }

    const odds = (chance / (1 - chance)) * Luck.CHANCE_SPREAD ** (this.getShare() * 2 - 1);

    return odds / (1 + odds);
  }

  /** Возвращает удачливость долей от 0 до 1 */
  private getShare(): number {
    return (this.value - Luck.MIN) / (Luck.MAX - Luck.MIN);
  }

  private assertValue(value: number): void {
    if (!Number.isFinite(value) || value < Luck.MIN || value > Luck.MAX) {
      throw new RangeError(
        `Удачливость должна быть числом от ${Luck.MIN} до ${Luck.MAX}, получено ${value}`
      );
    }
  }
}

export class LuckFactory implements ITraitFactory<ILuck> {
  create(value: number): ILuck {
    return new Luck(value);
  }
}
