import { vi } from 'vitest';

import { Addictions } from '../src';
import type { IAddictions, IAddictionsFactory } from '../src';

import { createAddictionsDeps, createAddictionsState } from './addictions';

/** Создаёт фабрику, которая всегда возвращает переданные зависимости */
export function createMockedAddictionsFactory(
  addictions: IAddictions = new Addictions(createAddictionsState(), createAddictionsDeps())
): IAddictionsFactory {
  return { create: vi.fn(() => addictions) };
}
