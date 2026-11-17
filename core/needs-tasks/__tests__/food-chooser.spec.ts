import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { Activity, Need } from '@peetland/needs';
import { createMockedNeeds } from '@peetland/needs/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { FoodChooser } from '../src/food-chooser';

describe('FoodChooser', () => {
  describe('#choose', () => {
    it('Если до максимума добивает несколько еды, выбирает ту, что меньше переедает', () => {
      // Обе добивают сытость 50 до 100, но первая переедает на 50, а вторая — на 10
      const needs = createMockedNeeds();
      needs.get.mockReturnValue(50);
      const gains: Partial<Record<Food, number>> = {
        [Item.SmilePizza]: 100,
        [Item.RomashkaLoaf]: 60,
      };
      needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);
      const state = new NpcStateBuilder().withNeeds(() => needs).build();

      const food = new FoodChooser().choose(state, [Item.SmilePizza, Item.RomashkaLoaf]);

      expect(food).toBe(Item.RomashkaLoaf);
    });

    it('Еду, которая добивает до максимума, предпочитает той, что не добивает', () => {
      // Сытость 30: первая восполнит до 90, вторая — до максимума
      const needs = createMockedNeeds();
      needs.get.mockReturnValue(30);
      const gains: Partial<Record<Food, number>> = {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 100,
      };
      needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);
      const state = new NpcStateBuilder().withNeeds(() => needs).build();

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

      expect(food).toBe(Item.SmilePizza);
    });

    it('Если до максимума не добивает никакая еда, выбирает ту, что восполняет больше', () => {
      // Сытость 10: первая восполнит до 70, вторая — до 90
      const needs = createMockedNeeds();
      needs.get.mockReturnValue(10);
      const gains: Partial<Record<Food, number>> = {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 80,
      };
      needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);
      const state = new NpcStateBuilder().withNeeds(() => needs).build();

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

      expect(food).toBe(Item.SmilePizza);
    });

    it('Выбирает только из переданной еды', () => {
      // Лучше подошла бы вторая еда, но её не передали
      const needs = createMockedNeeds();
      needs.get.mockReturnValue(30);
      const gains: Partial<Record<Food, number>> = {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 100,
      };
      needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);
      const state = new NpcStateBuilder().withNeeds(() => needs).build();

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf]);

      expect(food).toBe(Item.RomashkaLoaf);
    });

    it('Берёт сытость на момент времени из состояния', () => {
      const needs = createMockedNeeds();
      needs.get.mockReturnValue(30);
      const gains: Partial<Record<Food, number>> = { [Item.RomashkaLoaf]: 60 };
      needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);
      const state = new NpcStateBuilder().withNeeds(() => needs).build();

      new FoodChooser().choose(state, [Item.RomashkaLoaf]);

      expect(needs.get).toHaveBeenCalledWith(Need.Satiety, state.world.time);
    });

    it('Сколько еда восполнит сытости, спрашивает у потребностей', () => {
      const needs = createMockedNeeds();
      needs.get.mockReturnValue(30);
      const gains: Partial<Record<Food, number>> = { [Item.RomashkaLoaf]: 60 };
      needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);
      const state = new NpcStateBuilder().withNeeds(() => needs).build();

      new FoodChooser().choose(state, [Item.RomashkaLoaf]);

      expect(needs.getGain).toHaveBeenCalledWith(Need.Satiety, Activity.Eat, {
        food: Item.RomashkaLoaf,
      });
    });

    it('Если выбирать не из чего, выбрасывает ошибку', () => {
      function choose() {
        return new FoodChooser().choose(NpcStateBuilder.default(), []);
      }

      expect(choose).toThrow(Error);
    });
  });
});
