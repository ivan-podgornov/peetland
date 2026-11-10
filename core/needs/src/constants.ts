/**
 * Баланс потребностей: значения, которые подбираются, чтобы потребности падали и восполнялись как
 * задумано. Свойства модели, которые не настраиваются, лежат статическими полями своих классов
 */
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
  },
};

/** На сколько растёт сытость, когда NPC поел: досыта, чтобы жизнь NPC не крутилась вокруг еды */
export const EAT_SATIETY = 100;
