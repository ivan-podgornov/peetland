import { vi } from 'vitest';

import { Needs } from '../src';
import type { INeeds, INeedsFactory } from '../src';

import { createNeedsDeps, createNeedsState } from './needs';

/** Создаёт фабрику, которая всегда возвращает переданные потребности */
export function createMockedNeedsFactory(
  needs: INeeds = new Needs(createNeedsState(), createNeedsDeps())
): INeedsFactory {
  return { create: vi.fn(() => needs) };
}
