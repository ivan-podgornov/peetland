/**
 * Баланс потребностей: значения, которые подбираются, чтобы потребности падали и восполнялись как
 * задумано. Свойства модели, которые не настраиваются, лежат статическими полями своих классов
 */
import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';

/** Минут в игровых сутках */
const MINUTES_PER_DAY = 24 * 60;

/** За сколько игровых минут сытость падает до нуля. Сутки, а не 8 часов: иначе вся жизнь NPC крутится вокруг еды */
export const SATIETY_DEPLETION_MINUTES = MINUTES_PER_DAY;

/** Ниже этой сытости голод срочный: за 6 часов до голода */
export const SATIETY_URGENT_BELOW = 25;

/** Выше этой сытости голод перестаёт быть срочным */
export const SATIETY_CALM_ABOVE = 60;

/** На сколько растёт сытость от каждой еды */
export const FOOD_SATIETY: Readonly<Record<Food['name'], number>> = {
  [Item.RomashkaLoaf.name]: 60,
  [Item.SmilePizza.name]: 100,
};
