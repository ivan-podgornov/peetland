import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#set', () => {
    it('Заменяет текущее количество предмета', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);

      inventory.set(Item.Money, 2);

      expect(inventory.get(Item.Money)).toBe(2);
    });

    it('Если количество отрицательное, выбрасывает RangeError', () => {
      const inventory = new Inventory();

      expect(() => inventory.set(Item.Money, -1)).toThrow(RangeError);
    });

    it('Устанавливает дробное количество', () => {
      const inventory = new Inventory();

      inventory.set(Item.Money, 1.5);

      expect(inventory.get(Item.Money)).toBe(1.5);
    });

    it('Если количество не число, выбрасывает RangeError', () => {
      const inventory = new Inventory();

      expect(() => inventory.set(Item.Money, NaN)).toThrow(RangeError);
    });

    it('Если количество бесконечное, выбрасывает RangeError', () => {
      const inventory = new Inventory();

      expect(() => inventory.set(Item.Money, Infinity)).toThrow(RangeError);
    });
  });
});
