import { vi } from 'vitest';

import { Inventory } from '../src';
import type { IInventoryFactory } from '../src';

/** Создаёт фабрику, которая всегда возвращает переданный инвентарь */
export function createMockedInventoryFactory(
  inventory: Inventory = new Inventory()
): IInventoryFactory {
  return { create: vi.fn(() => inventory) };
}
