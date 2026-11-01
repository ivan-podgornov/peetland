import { vi } from 'vitest';

import { Inventory } from '../src';
import type { IInventoryFactory, InventoryCounts } from '../src';

/** Создаёт фабрику, которая всегда возвращает переданный инвентарь */
export function createMockedInventoryFactory(
  inventory: Inventory = new Inventory()
): IInventoryFactory {
  return { create: vi.fn((_counts?: InventoryCounts) => inventory) };
}
