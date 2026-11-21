import { vi } from 'vitest';

import type { IActor, IActorRegistry } from '../src';

/** Создаёт реестр, который getAll возвращает переданных акторов */
export function createMockedRegistry(actors: IActor[] = []): IActorRegistry {
  return {
    register: vi.fn(),
    remove: vi.fn(),
    getAll: vi.fn(() => actors),
  };
}
