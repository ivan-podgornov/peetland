/**
 * Баланс задач удовлетворения потребностей: значения, которые подбираются, чтобы NPC удовлетворяли
 * потребности как задумано
 */
import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';

/** Цена еды в магазине, в долларах */
export const FOOD_PRICES: Readonly<Record<Food, number>> = {
  [Item.RomashkaLoaf]: 80,
  [Item.SmilePizza]: 120,
};

/**
 * Сытость, при которой NPC съест еду, купленную про запас: ниже неё голод загорается. Должна
 * совпадать с порогом срочности сытости из @peetland/needs
 */
export const EATING_SATIETY = 25;
