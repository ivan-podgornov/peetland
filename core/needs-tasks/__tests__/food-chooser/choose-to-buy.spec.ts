import { Item, ItemClassifier } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { FOOD_PRICES } from '../../src/constants';
import { FoodChooser } from '../../src/food-chooser';

describe('FoodChooser', () => {
  describe('#chooseToBuy', () => {
    it('Выбирает только из еды, на которую хватает денег', () => {
      // Выгоднее была бы пицца, но на неё не хватает
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: FOOD_PRICES[Item.SmilePizza] - 1 })
        .build();

      expect(chooser.chooseToBuy(state, 0)).toBe(Item.RomashkaLoaf);
    });

    it('Если денег хватает впритык, еду можно купить', () => {
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: FOOD_PRICES[Item.RomashkaLoaf] })
        .build();

      expect(chooser.chooseToBuy(state, 0)).toBe(Item.RomashkaLoaf);
    });

    it('Если денег не хватает ни на какую еду, возвращает null', () => {
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: FOOD_PRICES[Item.RomashkaLoaf] - 1 })
        .build();

      expect(chooser.chooseToBuy(state, 0)).toBeNull();
    });
  });
});
