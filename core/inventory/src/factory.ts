import { Inventory } from './inventory';
import type { InventoryCounts } from './inventory';

export interface IInventoryFactory {
  /** Создаёт инвентарь с начальным количеством предметов (см. Inventory) */
  create(counts?: InventoryCounts): Inventory;
}

export class InventoryFactory implements IInventoryFactory {
  create(counts: InventoryCounts = {}): Inventory {
    return new Inventory(counts);
  }
}
