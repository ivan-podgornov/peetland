import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Feeling, Trait } from '../src';
import type {
  FeelingsContribution,
  ILuck,
  ITrait,
  ITraitFactory,
  PsycheState,
  TraitFactories,
} from '../src';
import type { PsycheDeps } from '../src/psyche';

/** Создаёт черту, которая на любой поступок возвращает переданный вклад */
export function createMockedTrait(contribution: FeelingsContribution = {}): Mocked<ITrait> {
  return { react: vi.fn(() => contribution) };
}

/** Создаёт удачливость, которая на любой поступок возвращает переданный вклад и не меняет шанс */
export function createMockedLuck(contribution: FeelingsContribution = {}): Mocked<ILuck> {
  return {
    ...createMockedTrait(contribution),
    adjustChance: vi.fn((chance: number) => chance),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную черту */
export function createMockedTraitFactory(): Mocked<ITraitFactory>;
export function createMockedTraitFactory<T extends ITrait>(trait: T): Mocked<ITraitFactory<T>>;
export function createMockedTraitFactory(
  trait: ITrait = createMockedTrait()
): Mocked<ITraitFactory> {
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

/**
 * Создаёт зависимости психики. Фабрики черт, которые не переданы, создают черты без вкладов, а
 * удачливость не меняет шанс
 */
export function createPsycheDeps(traitFactories: Partial<TraitFactories> = {}): PsycheDeps {
  return {
    traitFactories: {
      [Trait.Conscientiousness]: createMockedTraitFactory(),
      [Trait.Luck]: createMockedTraitFactory(createMockedLuck()),
      ...traitFactories,
    },
  };
}
