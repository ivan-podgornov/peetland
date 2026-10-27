import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#clone', () => {
    it('Возвращает копию с тем же количеством предметов', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);

      const copy = inventory.clone();

      expect(copy.get(Item.Money)).toBe(5);
    });

    it('Изменение копии не меняет исходный инвентарь', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);
      const copy = inventory.clone();

      copy.remove(Item.Money, 5);

      expect(inventory.get(Item.Money)).toBe(5);
    });

    it('Изменение исходного инвентаря не меняет копию', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);
      const copy = inventory.clone();

      inventory.add(Item.Money, 1);

      expect(copy.get(Item.Money)).toBe(5);
    });
  });
});
