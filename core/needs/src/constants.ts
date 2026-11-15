/**
 * Баланс потребностей: значения, которые подбираются, чтобы потребности падали и восполнялись как
 * задумано. Свойства модели, которые не настраиваются, лежат статическими полями своих классов
 */
import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';

import { NeedCategory } from './category';
import { Need } from './need';
import type { NeedDefinitions } from './types';

/** Минут в игровых сутках */
const MINUTES_PER_DAY = 24 * 60;

/** Описание каждой потребности */
export const NEED_DEFINITIONS: NeedDefinitions = {
  // Сутки, а не 8 часов: иначе вся жизнь NPC крутится вокруг еды
  [Need.Satiety]: {
    category: NeedCategory.Vital,
    depletionMinutes: MINUTES_PER_DAY,
    // Срочно за 6 часов до голода
    urgentBelow: 25,
    calmAbove: 60,
  },
};

/** На сколько растёт сытость от каждой еды */
export const FOOD_SATIETY: Readonly<Record<Food, number>> = {
  [Item.Romashka]: 60,
  // Досыта, чтобы жизнь NPC не крутилась вокруг еды
  [Item.Smile]: 100,
};
