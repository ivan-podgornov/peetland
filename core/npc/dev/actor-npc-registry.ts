import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { IActorNpcRegistry } from '../src';

/**
 * Создаёт мок реестра связей «актор ↔ NPC». Регистрации никуда не пишутся, переводы бросают
 * ошибки, а hasNpc говорит, что личности нет
 */
export function createMockedActorNpcRegistry(): Mocked<IActorNpcRegistry> {
  return {
    register: vi.fn(),
    getActor: vi.fn(() => {
      throw new Error('NPC не в реестре');
    }),
    getNpc: vi.fn(() => {
      throw new Error('У актора нет NPC в реестре');
    }),
    hasNpc: vi.fn(() => false),
  };
}
