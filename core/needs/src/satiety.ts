import { Activity } from './activity';
import { BaseNeed } from './base-need';
import type { NeedContributors } from './base-need';
import { NeedCategory } from './category';
import {
  FOOD_SATIETY,
  SATIETY_CALM_ABOVE,
  SATIETY_DEPLETION_MINUTES,
  SATIETY_URGENT_BELOW,
} from './constants';

/** Сытость: жизненная потребность. Падает, пока NPC не ест, а еда восполняет её по тому, что съели */
export class Satiety extends BaseNeed {
  /** Ниже этой сытости голод срочный */
  static readonly URGENT_BELOW = SATIETY_URGENT_BELOW;

  /** Выше этой сытости голод перестаёт быть срочным */
  static readonly CALM_ABOVE = SATIETY_CALM_ABOVE;

  readonly category = NeedCategory.Vital;

  protected readonly depletionMinutes = SATIETY_DEPLETION_MINUTES;
  protected readonly urgentBelow = Satiety.URGENT_BELOW;
  protected readonly calmAbove = Satiety.CALM_ABOVE;

  protected readonly contributors: NeedContributors = {
    [Activity.Eat]: (details) => FOOD_SATIETY[details.food],
  };
}
