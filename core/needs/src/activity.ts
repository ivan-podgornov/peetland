import type { Booze, Food } from '@peetland/inventory';

/** Виды занятий, от которых меняются потребности */
export enum ActivityType {
  /** Поел */
  Eat = 'eat',
  /** Выпил */
  Drink = 'drink',
}

/** Детали еды: что съели. От этого зависит, сколько восполнится сытости */
export type EatDetails = Readonly<{
  food: Food;
}>;

/** Детали питья: что выпили */
export type DrinkDetails = Readonly<{
  booze: Booze;
}>;

/** Детали каждого вида занятий */
export type ActivityDetails = {
  [ActivityType.Eat]: EatDetails;
  [ActivityType.Drink]: DrinkDetails;
};

/** Занятие, от которого меняются потребности: его вид и детали */
export type Activity = {
  [T in ActivityType]: Readonly<{
    type: T;
    details: ActivityDetails[T];
  }>;
}[ActivityType];
