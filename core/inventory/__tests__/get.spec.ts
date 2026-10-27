import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#get', () => {
    it('Если предмета нет, возвращает 0', () => {
      const inventory = new Inventory();

      expect(inventory.get(Item.Money)).toBe(0);
    });

    it('Возвращает установленное количество предмета', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);

      expect(inventory.get(Item.Money)).toBe(5);
    });

    it('Возвращает количество только указанного предмета', () => {
      const inventory = new Inventory();
      inventory.set(Item.Bottles, 5);

      expect(inventory.get(Item.Booze)).toBe(0);
    });
  });
});
