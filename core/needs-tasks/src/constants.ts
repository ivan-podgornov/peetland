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
