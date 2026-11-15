import type { Food } from '@peetland/inventory';

/** Занятия, от которых меняются потребности */
export enum Activity {
  /** Поел */
  Eat = 'eat',
}

/** Детали еды: что съели. От этого зависит, сколько восполнится сытости (см. FOOD_SATIETY) */
export type EatDetails = Readonly<{
  food: Food;
}>;

/** Детали каждого занятия */
export type ActivityDetails = {
  [Activity.Eat]: EatDetails;
};
