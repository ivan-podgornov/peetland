import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#has', () => {
    it('Если предмета нет, возвращает false', () => {
      const inventory = new Inventory();

      expect(inventory.has(Item.Booze)).toBe(false);
    });

    it('Если количество предмета больше нуля, возвращает true', () => {
      const inventory = new Inventory();
      inventory.set(Item.Booze, 1);

      expect(inventory.has(Item.Booze)).toBe(true);
    });

    it('Если количество предмета равно нулю, возвращает false', () => {
      const inventory = new Inventory();
      inventory.set(Item.Booze, 0);

      expect(inventory.has(Item.Booze)).toBe(false);
    });
  });
});
