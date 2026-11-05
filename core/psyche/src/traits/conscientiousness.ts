import { BEGGING_SHAME, BOTTLE_FOUND_SHAME_RELIEF } from '../constants';
import { Deed } from '../deed';
import { Feeling } from '../feeling';
import type { FeelingsContribution, ITrait, ITraitFactory } from '../types';

/**
 * Совестливость. Чем она выше, тем быстрее растёт стыд, когда NPC клянчит, и тем медленнее падает,
 * когда NPC сам находит бутылки. При средней совестливости стыд меняется на BEGGING_SHAME и
 * BOTTLE_FOUND_SHAME_RELIEF, а на краях — вдвое медленнее или в полтора раза быстрее
 */
export class Conscientiousness implements ITrait {
  /** Минимальная совестливость */
  static readonly MIN = 0;

  /** Максимальная совестливость */
  static readonly MAX = 100;

  private readonly value: number;

  /**
   * @param value - совестливость от Conscientiousness.MIN до Conscientiousness.MAX. Если она не
   * конечное число или вне пределов, выбрасывает RangeError
   */
  constructor(value: number) {
    this.assertValue(value);
    this.value = value;
  }

  react(deed: Deed): FeelingsContribution {
    switch (deed) {
      case Deed.Begging:
        return { [Feeling.Shame]: BEGGING_SHAME * (0.5 + this.getShare()) };
      case Deed.BottleFound:
        return { [Feeling.Shame]: -BOTTLE_FOUND_SHAME_RELIEF * (1.5 - this.getShare()) };
    }
  }

  /** Возвращает совестливость долей от 0 до 1 */
  private getShare(): number {
    return (this.value - Conscientiousness.MIN) / (Conscientiousness.MAX - Conscientiousness.MIN);
  }

  private assertValue(value: number): void {
    if (!Number.isFinite(value) || value < Conscientiousness.MIN || value > Conscientiousness.MAX) {
      throw new RangeError(
        `Совестливость должна быть числом от ${Conscientiousness.MIN} до ${Conscientiousness.MAX}, получено ${value}`
      );
    }
  }
}

export class ConscientiousnessFactory implements ITraitFactory {
  create(value: number): ITrait {
    return new Conscientiousness(value);
  }
}
