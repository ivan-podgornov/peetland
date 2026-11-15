import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#clone', () => {
    it('Возвращает инвентарь с тем же количеством предметов', () => {
      const inventory = new Inventory({
        [Item.Money]: 5,
        [Item.Bottles]: 2,
      });

      expect(inventory.clone().getAll()).toStrictEqual({
        [Item.Money]: 5,
        [Item.Bottles]: 2,
      });
    });

    it('Возвращает новый экземпляр Inventory', () => {
      const inventory = new Inventory();

      expect(inventory.clone()).not.toBe(inventory);
    });

    it('Изменение копии не меняет исходный инвентарь', () => {
      const inventory = new Inventory({ [Item.Money]: 5 });
      const copy = inventory.clone();

      copy.add(Item.Money, 10);

      expect(inventory.get(Item.Money)).toBe(5);
    });

    it('Изменение исходного инвентаря не меняет копию', () => {
      const inventory = new Inventory({ [Item.Money]: 5 });
      const copy = inventory.clone();

      inventory.add(Item.Money, 10);

      expect(copy.get(Item.Money)).toBe(5);
    });
  });
});
