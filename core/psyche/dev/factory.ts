import { vi } from 'vitest';

import { Psyche } from '../src';
import type { IPsyche, IPsycheFactory, PsycheState } from '../src';

import { createPsycheDeps, createPsycheState } from './psyche';

/** Создаёт фабрику, которая всегда возвращает переданную психику */
export function createMockedPsycheFactory(
  psyche: IPsyche = new Psyche(createPsycheState(), createPsycheDeps())
): IPsycheFactory {
  return { create: vi.fn((_state: PsycheState) => psyche) };
}
