import type { IActor } from '@peetland/game';
import { vi } from 'vitest';

import type { IVisionSystem } from '../src';

/** Создаёт систему зрения, которая возвращает переданных акторов */
export function createMockedVisionSystem(visible: IActor[] = []): IVisionSystem {
  return {
    getVisibleActors: vi.fn(() => visible),
  };
}
