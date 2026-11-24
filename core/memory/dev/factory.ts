import { vi } from 'vitest';

import { Memory } from '../src';
import type { Fact, IMemoryFactory } from '../src';

/**
 * Создаёт фабрику памяти для тестов: create возвращает память, в которой уже запомнены переданные
 * факты, поэтому recall возвращает только их. Если факты не переданы, память пуста
 */
export function createMockedMemoryFactory(facts: Fact[] = []): IMemoryFactory {
  const memory = new Memory();

  facts.forEach((fact) => memory.remember(fact));

  return { create: vi.fn(() => memory) };
}
