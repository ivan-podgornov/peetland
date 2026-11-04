import { Psyche } from './psyche';
import type { IPsyche, PsycheDeps } from './psyche';
import { Trait } from './trait';
import { ConscientiousnessFactory, LuckFactory, OptimismFactory } from './traits';
import type { PsycheState, TraitFactories } from './types';

export interface IPsycheFactory {
  /** Собирает психику из состояния (см. Psyche) */
  create(state: PsycheState): IPsyche;
}

export type PsycheFactoryDeps = {
  /**
   * Фабрики черт, которые заменяют фабрики по умолчанию. По умолчанию у каждой черты своя фабрика
   * из этого пакета
   */
  traitFactories?: Partial<TraitFactories>;
};

export class PsycheFactory implements IPsycheFactory {
  private readonly deps: PsycheDeps;

  constructor(deps: PsycheFactoryDeps = {}) {
    const { traitFactories = {} } = deps;

    this.deps = {
      traitFactories: {
        [Trait.Conscientiousness]:
          traitFactories[Trait.Conscientiousness] ?? new ConscientiousnessFactory(),
        [Trait.Luck]: traitFactories[Trait.Luck] ?? new LuckFactory(),
        [Trait.Optimism]: traitFactories[Trait.Optimism] ?? new OptimismFactory(),
      },
    };
  }

  create(state: PsycheState): IPsyche {
    return new Psyche(state, this.deps);
  }
}
