/** Занятия, от которых меняются потребности */
export enum Activity {
  /** Поел */
  Eat = 'eat',
}

/**
 * Детали еды: что съели. Пока еды в игре нет, деталей нет, а когда появится, от того, что съели,
 * будет зависеть, как меняются потребности
 */
export type EatDetails = Readonly<Record<string, never>>;

/** Детали каждого занятия */
export type ActivityDetails = {
  [Activity.Eat]: EatDetails;
};
