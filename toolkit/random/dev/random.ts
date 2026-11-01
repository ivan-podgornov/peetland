import { vi } from 'vitest';

import type { IRandom } from '../src';

/** Создаёт источник случайных чисел, у которого шанс всегда выпадает или всегда не выпадает */
export function createMockedRandom(isLucky: boolean): IRandom {
  return { chance: vi.fn((_probability: number) => isLucky) };
}
