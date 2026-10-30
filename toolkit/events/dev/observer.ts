import { vi } from 'vitest';

import type { IObserver } from '../src';

/** Создаёт наблюдателя, все методы которого — моки */
export function createMockedObserver() {
  return {
    next: vi.fn(),
    complete: vi.fn(),
    error: vi.fn(),
  } satisfies IObserver<unknown>;
}
