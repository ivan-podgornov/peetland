import { describe, expect, it } from 'vitest';

import { Item, ItemClassifier } from '../src';

describe('ItemClassifier', () => {
  describe('#isFood', () => {
    it.each([Item.RomashkaLoaf, Item.SmilePizza])(
      'Если у предмета есть тег еды (%s), возвращает true',
      (item) => {
        expect(new ItemClassifier().isFood(item)).toBe(true);
      }
    );

    it.each([Item.Money, Item.Bottles, Item.Booze])(
      'Если у предмета нет тега еды (%s), возвращает false',
      (item) => {
        expect(new ItemClassifier().isFood(item)).toBe(false);
      }
    );
  });

  describe('#isBooze', () => {
    it('Если предмет — пойло, возвращает true', () => {
      expect(new ItemClassifier().isBooze(Item.Booze)).toBe(true);
    });

    it.each([Item.Money, Item.Bottles, Item.RomashkaLoaf, Item.SmilePizza])(
      'Если предмет не пойло (%s), возвращает false',
      (item) => {
        expect(new ItemClassifier().isBooze(item)).toBe(false);
      }
    );
  });
});
