import { Item } from './item';
import type { Food } from './item';

/** Определяет, к какому виду относится предмет */
export interface IItemClassifier {
  /** Возвращает, еда ли предмет */
  isFood(item: Item): item is Food;
}

export class ItemClassifier implements IItemClassifier {
  /** Предметы, которые можно съесть */
  private static readonly FOOD: readonly Item[] = [
    Item.RomashkaLoaf,
    Item.SmilePizza,
  ] satisfies Food[];

  isFood(item: Item): item is Food {
    return ItemClassifier.FOOD.includes(item);
  }
}
