import type { Food } from '@peetland/inventory';

/** Виды занятий, от которых меняются потребности */
export enum ActivityType {
  /** Поел */
  Eat = 'eat',
}

/** Детали еды: что съели. От этого зависит, сколько восполнится сытости */
export type EatDetails = Readonly<{
  food: Food;
}>;

/** Детали каждого вида занятий */
export type ActivityDetails = {
  [ActivityType.Eat]: EatDetails;
};

/** Занятие, от которого меняются потребности: его вид и детали */
export type Activity = {
  [T in ActivityType]: Readonly<{
    type: T;
    details: ActivityDetails[T];
  }>;
}[ActivityType];
