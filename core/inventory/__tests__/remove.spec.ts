import { describe, expect, it } from 'vitest';

import { Inventory, Item } from '../src';

describe('Inventory', () => {
  describe('#remove', () => {
    describe('Если предмета хватает', () => {
      it('Отнимает указанное количество', () => {
        const inventory = new Inventory();
        inventory.set(Item.Money, 5);

        inventory.remove(Item.Money, 3);

        expect(inventory.get(Item.Money)).toBe(2);
      });

      it('Возвращает true', () => {
        const inventory = new Inventory();
        inventory.set(Item.Money, 5);

        expect(inventory.remove(Item.Money, 3)).toBe(true);
      });

      it('Если отнимается всё количество, предмета больше нет', () => {
        const inventory = new Inventory();
        inventory.set(Item.Money, 5);

        inventory.remove(Item.Money, 5);

        expect(inventory.has(Item.Money)).toBe(false);
      });
    });

    describe('Если предмета не хватает', () => {
      it('Не меняет количество', () => {
        const inventory = new Inventory();
        inventory.set(Item.Money, 2);

        inventory.remove(Item.Money, 3);

        expect(inventory.get(Item.Money)).toBe(2);
      });

      it('Возвращает false', () => {
        const inventory = new Inventory();
        inventory.set(Item.Money, 2);

        expect(inventory.remove(Item.Money, 3)).toBe(false);
      });
    });

    it('Если предмета нет, возвращает false', () => {
      const inventory = new Inventory();

      expect(inventory.remove(Item.Money, 1)).toBe(false);
    });

    it('Если количество отрицательное, выбрасывает RangeError', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);

      expect(() => inventory.remove(Item.Money, -1)).toThrow(RangeError);
    });

    it('Отнимает дробное количество', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 1);

      inventory.remove(Item.Money, 0.5);

      expect(inventory.get(Item.Money)).toBe(0.5);
    });

    it('Если количество не число, выбрасывает RangeError', () => {
      const inventory = new Inventory();
      inventory.set(Item.Money, 5);

      expect(() => inventory.remove(Item.Money, NaN)).toThrow(RangeError);
    });
  });
});
