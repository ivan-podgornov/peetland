import { BaseNeed } from './base-need';
import type { NeedDeps, NeedOptions } from './base-need';
import { NeedCategory } from './category';
import type { AddictionRecord } from './types';

/**
 * Чем одна зависимость отличается от другой, кроме вклада занятий. Пределы силы у всех
 * зависимостей одни (см. BaseAddiction)
 */
export type AddictionOptions = Readonly<{
  /**
   * За сколько игровых минут при максимальной силе значение падает от MAX_NEED до порога
   * срочности, то есть через сколько после употребления снова тянет
   */
  cravingMinutes: number;
}>;

/**
 * Общая логика зависимостей. Значение — насколько NPC не тянет употребить: падает со скоростью,
 * пропорциональной силе зависимости, а при силе 0 не падает. Подкласс задаёт скорость при
 * максимальной силе опциями, а вклад занятий — в getGain
 */
export abstract class BaseAddiction extends BaseNeed {
  static readonly MIN_STRENGTH = 0;

  static readonly MAX_STRENGTH = 100;

  private readonly strength: number;

  /** @throws ошибку валидатора, если значение или сила не прошли проверку */
  constructor(record: AddictionRecord, options: AddictionOptions, deps: NeedDeps) {
    super(record, BaseAddiction.needOptions(record.strength, options), deps);
    deps.validator.validateStrength(
      record.strength,
      BaseAddiction.MIN_STRENGTH,
      BaseAddiction.MAX_STRENGTH
    );
    this.strength = record.strength;
  }

  /** Возвращает значение, момент, когда его выставили, и силу зависимости */
  override getState(): AddictionRecord {
    return {
      ...super.getState(),
      strength: this.strength,
    };
  }

  /** Опции потребности для зависимости с силой strength */
  private static needOptions(strength: number, options: AddictionOptions): NeedOptions {
    const fullDepletionAtMax =
      (options.cravingMinutes * BaseNeed.MAX_NEED) / (BaseNeed.MAX_NEED - BaseNeed.URGENT_BELOW);

    return {
      category: NeedCategory.Addiction,
      depletionMinutes:
        strength > 0 ? (fullDepletionAtMax * BaseAddiction.MAX_STRENGTH) / strength : Infinity,
    };
  }
}
