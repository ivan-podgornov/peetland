import { PsycheFactory } from '../src';
import type { Feeling, IPsyche, PsycheFeelings, PsycheTraits, Trait, TraitFactories } from '../src';

import { createPsycheState } from './psyche';

/**
 * Собирает психику по шагам. То, что не задано, заполняется незначимыми значениями: черты и чувства
 * как в createPsycheState, а черты собирают фабрики PsycheFactory по умолчанию. Каждый вызов build
 * возвращает новую психику
 *
 * @example
 * const psyche = new PsycheBuilder()
 *   .withTrait(Trait.Luck, 80)
 *   .withFeeling(Feeling.Shame, 30)
 *   .build();
 */
export class PsycheBuilder {
  private traits: PsycheTraits;
  private feelings: PsycheFeelings;
  private traitFactories: Partial<TraitFactories> = {};

  constructor() {
    const state = createPsycheState();
    this.traits = state.traits;
    this.feelings = state.feelings;
  }

  /** Задаёт значение черты характера */
  withTrait(trait: Trait, value: number): this {
    this.traits = {
      ...this.traits,
      [trait]: value,
    };
    return this;
  }

  /** Задаёт значение чувства */
  withFeeling(feeling: Feeling, value: number): this {
    this.feelings = {
      ...this.feelings,
      [feeling]: value,
    };
    return this;
  }

  /**
   * Задаёт фабрику, которой собирается черта. Нужна, когда для теста важно, как черта реагирует на
   * поступки
   */
  withTraitFactory<T extends Trait>(trait: T, factory: TraitFactories[T]): this {
    this.traitFactories = {
      ...this.traitFactories,
      [trait]: factory,
    };
    return this;
  }

  /** Возвращает собранную психику */
  build(): IPsyche {
    const factory = new PsycheFactory({ traitFactories: this.traitFactories });

    return factory.create({
      traits: this.traits,
      feelings: this.feelings,
    });
  }
}
