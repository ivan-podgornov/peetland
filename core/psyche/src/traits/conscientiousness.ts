import { Deed } from '../deed';
import { Feeling } from '../feeling';
import type { FeelingsContribution, ITrait, ITraitFactory } from '../types';

/** Минимальная совестливость */
export const MIN_CONSCIENTIOUSNESS = 0;

/** Максимальная совестливость */
export const MAX_CONSCIENTIOUSNESS = 100;

/** На сколько растёт стыд за одну попытку клянчить при средней совестливости */
export const BEGGING_SHAME = 0.1;

/** На сколько падает стыд за одну найденную бутылку при средней совестливости */
export const BOTTLE_FOUND_SHAME_RELIEF = 2;

/**
 * Совестливость. Чем она выше, тем быстрее растёт стыд, когда NPC клянчит, и тем медленнее падает,
 * когда NPC сам находит бутылки. При средней совестливости стыд меняется на BEGGING_SHAME и
 * BOTTLE_FOUND_SHAME_RELIEF, а на краях — вдвое медленнее или в полтора раза быстрее
 */
export class Conscientiousness implements ITrait {
  private readonly value: number;

  /**
   * @param value - совестливость от MIN_CONSCIENTIOUSNESS до MAX_CONSCIENTIOUSNESS. Если она не
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
    return (this.value - MIN_CONSCIENTIOUSNESS) / (MAX_CONSCIENTIOUSNESS - MIN_CONSCIENTIOUSNESS);
  }

  private assertValue(value: number): void {
    if (!Number.isFinite(value) || value < MIN_CONSCIENTIOUSNESS || value > MAX_CONSCIENTIOUSNESS) {
      throw new RangeError(
        `Совестливость должна быть числом от ${MIN_CONSCIENTIOUSNESS} до ${MAX_CONSCIENTIOUSNESS}, получено ${value}`
      );
    }
  }
}

export class ConscientiousnessFactory implements ITraitFactory {
  create(value: number): ITrait {
    return new Conscientiousness(value);
  }
}
