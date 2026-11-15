/** Тег предмета: к какому виду предметов он относится. У предмета может быть несколько тегов */
export enum ItemTag {
  /** Еда: предмет можно съесть */
  Food = 'food',
}

/** Описание предмета */
export type ItemDefinition = Readonly<{
  /** Имя предмета. По нему инвентарь хранит и сохраняет количество */
  name: string;
  /** Теги предмета (см. ItemClassifier) */
  tags: readonly ItemTag[];
}>;

/** Предметы. В коде предметы всегда указываются через Item, а не именами */
export const Item = {
  Money: {
    name: 'money',
    tags: [],
  },
  Bottles: {
    name: 'bottles',
    tags: [],
  },
  Booze: {
    name: 'booze',
    tags: [],
  },
  RomashkaLoaf: {
    name: 'romashka-loaf',
    tags: [ItemTag.Food],
  },
  SmilePizza: {
    name: 'smile-pizza',
    tags: [ItemTag.Food],
  },
} as const satisfies Readonly<Record<string, ItemDefinition>>;

/** Предмет: одно из описаний в Item */
export type Item = (typeof Item)[keyof typeof Item];

/** Имя предмета */
export type ItemName = Item['name'];

/** Предметы с тегом T */
export type ItemWithTag<T extends ItemTag, I extends Item = Item> = I extends Item
  ? T extends I['tags'][number]
    ? I
    : never
  : never;

/** Еда: предмет с тегом ItemTag.Food */
export type Food = ItemWithTag<ItemTag.Food>;
