import type { Booze } from '@peetland/inventory';

/** Виды употребления, которые снимают тягу */
export enum ConsumptionType {
  /** Выпил */
  Drink = 'drink',
}

/** Детали питья: что выпили */
export type DrinkDetails = Readonly<{
  booze: Booze;
}>;

/** Детали каждого вида употребления */
export type ConsumptionDetails = {
  [ConsumptionType.Drink]: DrinkDetails;
};

/** Употребление, которое снимает тягу: его вид и детали */
export type Consumption = {
  [T in ConsumptionType]: Readonly<{
    type: T;
    details: ConsumptionDetails[T];
  }>;
}[ConsumptionType];
