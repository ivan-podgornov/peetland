import { describe, expect, it } from 'vitest';

import { Inventory, InventoryFactory } from '../src';

describe('InventoryFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Inventory', () => {
      const factory = new InventoryFactory();

      const inventory = factory.create();

      expect(inventory).toBeInstanceOf(Inventory);
    });
  });
});
