import { vi } from 'vitest';

import { Feeling, Trait } from '../src';
import type {
  FeelingsContribution,
  ITrait,
  ITraitFactory,
  PsycheDeps,
  PsycheState,
  TraitFactories,
} from '../src';

/** Создаёт черту, которая на любой поступок возвращает переданный вклад */
export function createMockedTrait(contribution: FeelingsContribution = {}): ITrait {
  return { react: vi.fn(() => contribution) };
}

/** Создаёт фабрику, которая всегда возвращает переданную черту */
export function createMockedTraitFactory(trait: ITrait = createMockedTrait()): ITraitFactory {
  return { create: vi.fn(() => trait) };
}

/** Создаёт состояние психики. Поля, которые не переданы, заполняются незначимыми значениями */
export function createPsycheState(state: Partial<PsycheState> = {}): PsycheState {
  return {
    traits: {
      [Trait.Conscientiousness]: 50,
      [Trait.Luck]: 50,
    },
    feelings: {
      [Feeling.Shame]: 0,
    },
    ...state,
  };
}

/** Создаёт зависимости психики. Фабрики черт, которые не переданы, создают черты без вклада */
export function createPsycheDeps(traitFactories: Partial<TraitFactories> = {}): PsycheDeps {
  return {
    traitFactories: {
      [Trait.Conscientiousness]: createMockedTraitFactory(),
      [Trait.Luck]: createMockedTraitFactory(),
      ...traitFactories,
    },
  };
}
