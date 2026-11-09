import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Psyche } from '../src';
import type { IPsyche, IPsycheFactory, PsycheState } from '../src';

import { createPsycheDeps, createPsycheState } from './psyche';

/**
 * Создаёт психику, которая ничего не делает на поступки, всегда возвращает переданное состояние, не
 * меняет шанс и ожидает попыток как реалист: 1 / шанс. Копия из clone — такая же психика
 */
export function createMockedPsyche(state: PsycheState = createPsycheState()): Mocked<IPsyche> {
  return {
    getState: vi.fn(() => state),
    react: vi.fn(),
    adjustChance: vi.fn((chance: number) => chance),
    expectAttempts: vi.fn((chance: number) => Math.round(1 / chance)),
    clone: vi.fn(() => createMockedPsyche(state)),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную психику */
export function createMockedPsycheFactory(
  psyche: IPsyche = new Psyche(createPsycheState(), createPsycheDeps())
): IPsycheFactory {
  return { create: vi.fn(() => psyche) };
}
