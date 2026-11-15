import { Activity } from './activity';
import { NeedCategory } from './category';
import {
  FOOD_SATIETY,
  SATIETY_CALM_ABOVE,
  SATIETY_DEPLETION_MINUTES,
  SATIETY_URGENT_BELOW,
} from './constants';
import { NeedModel } from './need-model';
import type { NeedContributors } from './need-model';

/** Сытость: жизненная потребность. Падает, пока NPC не ест, а еда восполняет её по тому, что съели */
export class SatietyModel extends NeedModel {
  readonly category = NeedCategory.Vital;
  readonly urgentBelow = SATIETY_URGENT_BELOW;
  readonly calmAbove = SATIETY_CALM_ABOVE;

  protected readonly depletionMinutes = SATIETY_DEPLETION_MINUTES;

  protected readonly contributors: NeedContributors = {
    [Activity.Eat]: (details) => FOOD_SATIETY[details.food.name],
  };
}
