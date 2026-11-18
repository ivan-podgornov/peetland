import type { Booze } from '@peetland/inventory';

/** Виды занятий, от которых меняются зависимости */
export enum ActivityType {
  /** Выпил */
  Drink = 'drink',
}

/** Детали питья: что выпили */
export type DrinkDetails = Readonly<{
  booze: Booze;
}>;

/** Детали каждого вида занятий */
export type ActivityDetails = {
  [ActivityType.Drink]: DrinkDetails;
};

/** Занятие, от которого меняются зависимости: его вид и детали */
export type Activity = {
  [T in ActivityType]: Readonly<{
    type: T;
    details: ActivityDetails[T];
  }>;
}[ActivityType];
