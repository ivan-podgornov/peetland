import { Psyche } from './psyche';
import type { IPsyche, PsycheDeps } from './psyche';
import type { PsycheState } from './types';

export interface IPsycheFactory {
  /** Собирает психику из состояния (см. Psyche) */
  create(state: PsycheState): IPsyche;
}

export class PsycheFactory implements IPsycheFactory {
  private readonly deps: PsycheDeps;

  constructor(deps: PsycheDeps) {
    this.deps = deps;
  }

  create(state: PsycheState): IPsyche {
    return new Psyche(state, this.deps);
  }
}
