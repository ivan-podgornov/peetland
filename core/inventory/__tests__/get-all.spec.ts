import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#getAll', () => {
    it('Возвращает количество всех предметов в инвентаре', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);
      inventory.set(Item.Bottles, 2);

      expect(inventory.getAll()).toStrictEqual({ [Item.Money]: 5, [Item.Bottles]: 2 });
    });

    it('Не возвращает предметы, количество которых стало нулевым', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);

      inventory.remove(Item.Money, 5);

      expect(inventory.getAll()).toStrictEqual({});
    });

    it('Изменение возвращённого объекта не меняет инвентарь', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);

      const counts = inventory.getAll();
      counts[Item.Money] = 1;

      expect(inventory.get(Item.Money)).toBe(5);
    });
  });
});
