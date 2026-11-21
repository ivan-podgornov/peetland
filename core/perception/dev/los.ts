import { vi } from 'vitest';

import type { ILosProvider } from '../src';

/** Создаёт провайдер прямой видимости, который всегда возвращает isClear */
export function createMockedLos(isClear = true): ILosProvider {
  return {
    isLineOfSightClear: vi.fn(() => isClear),
  };
}
