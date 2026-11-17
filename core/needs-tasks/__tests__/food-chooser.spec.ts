import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { Activity, Need } from '@peetland/needs';
import { createMockedNeeds } from '@peetland/needs/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { FoodChooser } from '../src/food-chooser';

/**
 * Создаёт состояние NPC, у которого сытость равна satiety, а еда восполняет сытость на gains.
 * Потребности — мок: так видно, что выбор зависит только от сытости и того, сколько даёт еда
 */
function createState(satiety: number, gains: Partial<Record<Food, number>>) {
  const needs = createMockedNeeds();
  needs.get.mockReturnValue(satiety);
  needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);
  const state = NpcStateBuilder.default();

  return {
    needs,
    state: {
      ...state,
      self: {
        ...state.self,
        needs,
      },
    },
  };
}

describe('FoodChooser', () => {
  describe('#choose', () => {
    it('Если до максимума добивает несколько еды, выбирает ту, что меньше переедает', () => {
      // Обе добивают сытость 50 до 100, но первая переедает на 50, а вторая — на 10
      const { state } = createState(50, {
        [Item.SmilePizza]: 100,
        [Item.RomashkaLoaf]: 60,
      });

      const food = new FoodChooser().choose(state, [Item.SmilePizza, Item.RomashkaLoaf]);

      expect(food).toBe(Item.RomashkaLoaf);
    });

    it('Еду, которая добивает до максимума, предпочитает той, что не добивает', () => {
      // Сытость 30: первая восполнит до 90, вторая — до максимума
      const { state } = createState(30, {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 100,
      });

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

      expect(food).toBe(Item.SmilePizza);
    });

    it('Если до максимума не добивает никакая еда, выбирает ту, что восполняет больше', () => {
      // Сытость 10: первая восполнит до 70, вторая — до 90
      const { state } = createState(10, {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 80,
      });

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

      expect(food).toBe(Item.SmilePizza);
    });

    it('Выбирает только из переданной еды', () => {
      // Лучше подошла бы вторая еда, но её не передали
      const { state } = createState(30, {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 100,
      });

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf]);

      expect(food).toBe(Item.RomashkaLoaf);
    });

    it('Берёт сытость на момент времени из состояния', () => {
      const { needs, state } = createState(30, { [Item.RomashkaLoaf]: 60 });

      new FoodChooser().choose(state, [Item.RomashkaLoaf]);

      expect(needs.get).toHaveBeenCalledWith(Need.Satiety, state.world.time);
    });

    it('Сколько еда восполнит сытости, спрашивает у потребностей', () => {
      const { needs, state } = createState(30, { [Item.RomashkaLoaf]: 60 });

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
