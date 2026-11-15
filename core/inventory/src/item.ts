export enum Item {
  Money = 'money',
  Bottles = 'bottles',
  Booze = 'booze',
  /** Батон «Ромашка» */
  RomashkaLoaf = 'romashka-loaf',
  /** Пицца «Смайл» */
  SmilePizza = 'smile-pizza',
}

/** Еда: предмет, который можно съесть (см. ItemClassifier) */
export type Food = Item.RomashkaLoaf | Item.SmilePizza;
