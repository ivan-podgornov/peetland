import { Item, ItemClassifier } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { ActivityType, Need } from '@peetland/needs';
import { createMockedNeeds } from '@peetland/needs/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { FOOD_PRICES } from '../../src/constants';
import { FoodChooser } from '../../src/food-chooser';

describe('FoodChooser', () => {
  describe('Выбор оптимальной еды', () => {
    it('Выбирает еду, у которой соотношение питательности и цены лучше', () => {
      // Пицца: 100 сытости за $120 ≈ 0.83 за доллар, «Ромашка»: 60 за $80 = 0.75
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.RomashkaLoaf]: 1,
          [Item.SmilePizza]: 1,
        })
        .build();

      expect(chooser.chooseFromInventory(state, 0)).toBe(Item.SmilePizza);
    });

    it('Питательность считает с учётом того, что сытость не вырастет выше максимума', () => {
      // При сытости 25 в NPC влезет только 75: пицца даёт 75 за $120 ≈ 0.63 за доллар, а
      // «Ромашка» — 60 за $80 = 0.75
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.RomashkaLoaf]: 1,
          [Item.SmilePizza]: 1,
        })
        .build();

      expect(chooser.chooseFromInventory(state, 25)).toBe(Item.RomashkaLoaf);
    });

    it('Питательность считает от переданной сытости, а не от текущей', () => {
      // Сейчас сытость 0, и выгоднее пицца, но съест NPC еду при сытости 25, и выгоднее «Ромашка»
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.RomashkaLoaf]: 1,
          [Item.SmilePizza]: 1,
        })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      expect(chooser.chooseFromInventory(state, 25)).toBe(Item.RomashkaLoaf);
    });

    it('Если соотношение питательности и цены одинаковое, выбирает еду питательнее', () => {
      // Обе дают 0.75 сытости за доллар, но пицца восполнит 90, а «Ромашка» — 60
      const needs = createMockedNeeds();
      const gains: Record<Food, number> = {
        [Item.RomashkaLoaf]: 0.75 * FOOD_PRICES[Item.RomashkaLoaf],
        [Item.SmilePizza]: 0.75 * FOOD_PRICES[Item.SmilePizza],
      };
      needs.getGain.mockImplementation((_need, activity) => gains[activity.details.food]);
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.RomashkaLoaf]: 1,
          [Item.SmilePizza]: 1,
        })
        .withNeeds(() => needs)
        .build();

      expect(chooser.chooseFromInventory(state, 0)).toBe(Item.SmilePizza);
    });

    it('Сколько сытости восполнит еда, спрашивает у потребностей', () => {
      const needs = createMockedNeeds();
      const chooser = new FoodChooser({ itemClassifier: new ItemClassifier() });
      const state = new NpcStateBuilder()
        .withInventory({
          [Item.RomashkaLoaf]: 1,
          [Item.SmilePizza]: 1,
        })
        .withNeeds(() => needs)
        .build();

      chooser.chooseFromInventory(state, 0);

      expect(needs.getGain).toHaveBeenCalledWith(Need.Satiety, {
        type: ActivityType.Eat,
        details: { food: Item.RomashkaLoaf },
      });
    });
  });
});
