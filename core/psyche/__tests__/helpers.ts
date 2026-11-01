import { vi } from 'vitest';

import type { FeelingsContribution, ITrait, ITraitFactory, PsycheState } from '../src';

/** Создаёт черту, которая на любой поступок возвращает переданный вклад */
export function createTrait(contribution: FeelingsContribution = {}): ITrait {
  return { react: vi.fn(() => contribution) };
}

/** Создаёт фабрику, которая всегда возвращает переданную черту */
export function createTraitFactory(trait: ITrait = createTrait()): ITraitFactory {
  return { create: vi.fn(() => trait) };
}

/** Создаёт состояние психики. Поля, которые не переданы, пустые */
export function createPsycheState(state: Partial<PsycheState> = {}): PsycheState {
  return { traits: {}, feelings: {}, ...state };
}
