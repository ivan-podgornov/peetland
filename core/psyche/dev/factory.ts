import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Psyche } from '../src';
import type { IPsyche, IPsycheFactory, PsycheState } from '../src';

import { createPsycheDeps, createPsycheState } from './psyche';

/** Создаёт психику, которая ничего не делает на поступки, всегда возвращает переданное состояние и не меняет шанс */
export function createMockedPsyche(state: PsycheState = createPsycheState()): Mocked<IPsyche> {
  return {
    getState: vi.fn(() => state),
    react: vi.fn(),
    adjustChance: vi.fn((chance: number) => chance),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную психику */
export function createMockedPsycheFactory(
  psyche: IPsyche = new Psyche(createPsycheState(), createPsycheDeps())
): IPsycheFactory {
  return { create: vi.fn(() => psyche) };
}
