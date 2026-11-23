import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { IActorNpcRegistry } from '../src';

/**
 * Создаёт мок реестра связей «актор ↔ NPC». Переводы ничего не находят, а регистрации никуда не
 * пишутся
 */
export function createMockedActorNpcRegistry(): Mocked<IActorNpcRegistry> {
  return {
    register: vi.fn(),
    getActor: vi.fn(() => undefined),
    getNpc: vi.fn(() => undefined),
  };
}
