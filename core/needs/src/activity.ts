import type { Food } from '@peetland/inventory';

/** Занятия, от которых меняются потребности */
export enum Activity {
  /** Поел */
  Eat = 'eat',
}

/** Детали еды: что съели. От этого зависит, сколько восполнится сытости */
export type EatDetails = Readonly<{
  food: Food;
}>;

/** Детали каждого занятия */
export type ActivityDetails = {
  [Activity.Eat]: EatDetails;
};

/**
 * Занятие с его деталями. По полю activity TypeScript сужает тип деталей, поэтому потребностям не
 * нужно приводить детали к типу своего занятия
 */
export type PerformedActivity = {
  [A in Activity]: Readonly<{
    activity: A;
    details: ActivityDetails[A];
  }>;
}[Activity];
