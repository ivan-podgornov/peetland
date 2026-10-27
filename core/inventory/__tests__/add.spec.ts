import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#add', () => {
    it('Если предмета нет, устанавливает указанное количество', () => {
      const inventory = new Inventory();

      inventory.add(Item.Bottles, 3);

      expect(inventory.get(Item.Bottles)).toBe(3);
    });

    it('Прибавляет указанное количество к текущему', () => {
      const inventory = new Inventory();
      inventory.set(Item.Bottles, 2);

      inventory.add(Item.Bottles, 3);

      expect(inventory.get(Item.Bottles)).toBe(5);
    });

    it('Если количество отрицательное, выбрасывает RangeError', () => {
      const inventory = new Inventory();

      expect(() => inventory.add(Item.Bottles, -1)).toThrow(RangeError);
    });

    it('Прибавляет дробное количество', () => {
      const inventory = new Inventory();
      inventory.set(Item.Bottles, 1);

      inventory.add(Item.Bottles, 0.5);

      expect(inventory.get(Item.Bottles)).toBe(1.5);
    });

    it('Если количество не число, выбрасывает RangeError', () => {
      const inventory = new Inventory();

      expect(() => inventory.add(Item.Bottles, NaN)).toThrow(RangeError);
    });
  });
});
