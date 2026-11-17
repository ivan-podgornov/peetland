import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { createMockedNeeds } from '@peetland/needs/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { FoodChooser } from '../src/food-chooser';

describe('FoodChooser', () => {
  describe('#choose', () => {
    it.each<{ satiety: number; gains: Record<Food, number>; food: Food; reason: string }>([
      {
        satiety: 40,
        gains: {
          [Item.RomashkaLoaf]: 60,
          [Item.SmilePizza]: 100,
        },
        food: Item.RomashkaLoaf,
        reason: 'до максимума добивает и то и другое, но «Ромашка» меньше переедает',
      },
      {
        satiety: 30,
        gains: {
          [Item.RomashkaLoaf]: 60,
          [Item.SmilePizza]: 100,
        },
        food: Item.SmilePizza,
        reason: 'до максимума добивает только «Смайл»',
      },
      {
        satiety: 10,
        gains: {
          [Item.RomashkaLoaf]: 60,
          [Item.SmilePizza]: 80,
        },
        food: Item.SmilePizza,
        reason: 'до максимума ничто не добивает, а «Смайл» восполняет больше',
      },
    ])('При сытости $satiety выбирает $food: $reason', ({ satiety, gains, food }) => {
      const needs = createMockedNeeds();
      needs.get.mockReturnValue(satiety);
      needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food]);
      const initial = NpcStateBuilder.default();
      const state = {
        ...initial,
        self: {
          ...initial.self,
          needs,
        },
      };

      const chosen = new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

      expect(chosen).toBe(food);
    });

    it('Если выбирать не из чего, выбрасывает ошибку', () => {
      function choose() {
        return new FoodChooser().choose(NpcStateBuilder.default(), []);
      }

      expect(choose).toThrow(Error);
    });
  });
});
