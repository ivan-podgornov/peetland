import { NeedCategory } from './category';
import { Need } from './need';
import type { NeedDefinitions } from './types';

/** Минут в игровых сутках */
const MINUTES_PER_DAY = 24 * 60;

/** Описания потребностей по умолчанию */
export const NEED_DEFINITIONS: NeedDefinitions = {
  // Сутки, а не 8 часов: иначе вся жизнь NPC крутится вокруг еды
  [Need.Satiety]: {
    category: NeedCategory.Vital,
    depletionMinutes: MINUTES_PER_DAY,
  },
};
