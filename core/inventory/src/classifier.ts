import { Item } from './item';
import type { Booze, Food } from './item';

/** Определяет, к какому виду относится предмет */
export interface IItemClassifier {
  /** Возвращает, еда ли предмет */
  isFood(item: Item): item is Food;
  /** Возвращает, пойло ли предмет */
  isBooze(item: Item): item is Booze;
}

export class ItemClassifier implements IItemClassifier {
  /** Предметы, которые можно съесть */
  private static readonly FOOD: readonly Item[] = [
    Item.RomashkaLoaf,
    Item.SmilePizza,
  ] satisfies Food[];

  /** Предметы, которые можно выпить */
  private static readonly BOOZE: readonly Item[] = [Item.Booze] satisfies Booze[];

  isFood(item: Item): item is Food {
    return ItemClassifier.FOOD.includes(item);
  }

  isBooze(item: Item): item is Booze {
    return ItemClassifier.BOOZE.includes(item);
  }
}
