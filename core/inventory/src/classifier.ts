import { ItemTag } from './item';
import type { Food, Item } from './item';

/** Определяет по тегам, к какому виду относится предмет */
export interface IItemClassifier {
  /** Возвращает, еда ли предмет: есть ли у него тег ItemTag.Food */
  isFood(item: Item): item is Food;
}

export class ItemClassifier implements IItemClassifier {
  isFood(item: Item): item is Food {
    return this.hasTag(item, ItemTag.Food);
  }

  private hasTag(item: Item, tag: ItemTag): boolean {
    const tags: readonly ItemTag[] = item.tags;

    return tags.includes(tag);
  }
}
