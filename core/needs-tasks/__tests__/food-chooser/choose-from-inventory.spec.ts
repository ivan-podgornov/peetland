import { Item, ItemClassifier } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it, vi } from 'vitest';

import { FoodChooser } from '../../src/food-chooser';

describe('FoodChooser', () => {
  describe('#chooseFromInventory', () => {
    it('Выбирает только из еды в инвентаре', () => {
      // Выгоднее была бы пицца, но её в инвентаре нет
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.RomashkaLoaf]: 1,
          [Item.Money]: 1000,
        })
        .build();

      expect(chooser.chooseFromInventory(state, 0)).toBe(Item.RomashkaLoaf);
    });

    it('Если еды в инвентаре нет, возвращает null', () => {
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

      expect(chooser.chooseFromInventory(state, 0)).toBeNull();
    });

    it('Что из инвентаря еда, решает классификатор предметов', () => {
      const itemClassifier = new ItemClassifier();
      vi.spyOn(itemClassifier, 'isFood');
      const chooser = new FoodChooser({ itemClassifier });
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

      chooser.chooseFromInventory(state, 0);

      expect(itemClassifier.isFood).toHaveBeenCalledWith(Item.Booze);
    });
  });
});
