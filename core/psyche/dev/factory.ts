import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Psyche } from '../src';
import type { IPsyche, IPsycheFactory, PsycheState } from '../src';

import { createPsycheDeps, createPsycheState } from './psyche';

/**
 * Создаёт психику, которая ничего не делает на поступки, всегда возвращает переданное состояние, а
 * каждый модификатор — 1
 */
export function createMockedPsyche(state: PsycheState = createPsycheState()): Mocked<IPsyche> {
  return {
    getState: vi.fn(() => state),
    react: vi.fn(),
    getModifier: vi.fn(() => 1),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную психику */
export function createMockedPsycheFactory(
  psyche: IPsyche = new Psyche(createPsycheState(), createPsycheDeps())
): IPsycheFactory {
  return { create: vi.fn(() => psyche) };
}
