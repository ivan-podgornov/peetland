import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { Activity, Need } from '@peetland/needs';
import { createMockedNeeds } from '@peetland/needs/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { FOOD_PRICES } from '../src/constants';
import { FoodChooser } from '../src/food-chooser';

/** Создаёт состояние NPC с переданной сытостью, в котором еда восполняет переданную сытость */
function createState(satiety: number, gains: Partial<Record<Food, number>>) {
  const needs = createMockedNeeds();
  needs.get.mockReturnValue(satiety);
  needs.getGain.mockImplementation((_need, _activity, details) => gains[details.food] ?? 0);

  return {
    needs,
    state: new NpcStateBuilder().withNeeds(() => needs).build(),
  };
}

describe('FoodChooser', () => {
  describe('#choose', () => {
    it('Выбирает еду, что даёт больше сытости за доллар', () => {
      // Сытость 0: пицца даёт 100 / 120 ≈ 0.83 за доллар, батон — 60 / 80 = 0.75
      const { state } = createState(0, {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 100,
      });

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

      expect(food).toBe(Item.SmilePizza);
    });

    it('Сытость сверх максимума не считает', () => {
      // Сытость 25: пицца даёт без переедания 75 / 120 ≈ 0.63 за доллар, батон — 60 / 80 = 0.75
      const { state } = createState(25, {
        [Item.SmilePizza]: 100,
        [Item.RomashkaLoaf]: 60,
      });

      const food = new FoodChooser().choose(state, [Item.SmilePizza, Item.RomashkaLoaf]);

      expect(food).toBe(Item.RomashkaLoaf);
    });

    it('Если выгода равная, выбирает еду, что восполнит больше', () => {
      // Сытость 0: обе дают 0.75 за доллар, но пицца восполнит 90, а батон — 60
      const { state } = createState(0, {
        [Item.RomashkaLoaf]: 0.75 * FOOD_PRICES[Item.RomashkaLoaf],
        [Item.SmilePizza]: 0.75 * FOOD_PRICES[Item.SmilePizza],
      });

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

      expect(food).toBe(Item.SmilePizza);
    });

    it('Считает выгоду от переданной сытости, а не от текущей', () => {
      // Сытость 0: выгоднее пицца, а с переданной 25 — батон
      const { state } = createState(0, {
        [Item.SmilePizza]: 100,
        [Item.RomashkaLoaf]: 60,
      });

      const food = new FoodChooser().choose(state, [Item.SmilePizza, Item.RomashkaLoaf], 25);

      expect(food).toBe(Item.RomashkaLoaf);
    });

    it('Выбирает только из переданной еды', () => {
      // Выгоднее была бы пицца, но её не передали
      const { state } = createState(0, {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 100,
      });

      const food = new FoodChooser().choose(state, [Item.RomashkaLoaf]);

      expect(food).toBe(Item.RomashkaLoaf);
    });

    it('Если сытость не передана, берёт её на момент времени из состояния', () => {
      const { needs, state } = createState(30, { [Item.RomashkaLoaf]: 60 });

      new FoodChooser().choose(state, [Item.RomashkaLoaf]);

      expect(needs.get).toHaveBeenCalledWith(Need.Satiety, state.world.time);
    });

    it('Сколько еда восполнит сытости, спрашивает у потребностей', () => {
      const { needs, state } = createState(30, {
        [Item.RomashkaLoaf]: 60,
        [Item.SmilePizza]: 100,
      });

      new FoodChooser().choose(state, [Item.RomashkaLoaf, Item.SmilePizza]);

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
