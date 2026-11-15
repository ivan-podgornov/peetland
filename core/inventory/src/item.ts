export enum Item {
  Money = 'money',
  Bottles = 'bottles',
  Booze = 'booze',
  /** Батон «Ромашка» */
  Romashka = 'romashka',
  /** Пицца «Смайл» */
  Smile = 'smile',
}

/** Предметы, которые можно съесть */
export const FOOD = [Item.Romashka, Item.Smile] as const;

/** Еда: предмет, который можно съесть */
export type Food = (typeof FOOD)[number];

/** Возвращает, еда ли предмет */
export function isFood(item: Item): item is Food {
  return (FOOD as readonly Item[]).includes(item);
}
