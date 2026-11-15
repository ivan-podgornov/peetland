import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#constructor', () => {
    it('Если количество не передано, создаёт пустой инвентарь', () => {
      const inventory = new Inventory();

      expect(inventory.getAll()).toStrictEqual({});
    });

    it('Устанавливает переданное количество предметов', () => {
      const inventory = new Inventory({
        [Item.Money.name]: 5,
        [Item.Booze.name]: 0.5,
      });

      expect(inventory.getAll()).toStrictEqual({
        [Item.Money.name]: 5,
        [Item.Booze.name]: 0.5,
      });
    });

    it('Не добавляет предметы с нулевым количеством', () => {
      const inventory = new Inventory({ [Item.Money.name]: 0 });

      expect(inventory.getAll()).toStrictEqual({});
    });

    it('Если количество отрицательное, выбрасывает RangeError', () => {
      expect(() => new Inventory({ [Item.Money.name]: -1 })).toThrow(RangeError);
    });

    it('Изменение переданного объекта не меняет инвентарь', () => {
      const counts = { [Item.Money.name]: 5 };
      const inventory = new Inventory(counts);

      counts[Item.Money.name] = 1;

      expect(inventory.get(Item.Money)).toBe(5);
    });
  });
});
