import { Item } from './item';

/** Количество каждого предмета. Предметов, которых нет в инвентаре, в объекте нет */
export type InventoryCounts = Partial<Record<Item, number>>;

/**
 * Хранит количество каждого предмета. Количество — конечное неотрицательное число, в том числе
 * дробное. Предметы с нулевым количеством не хранятся
 */
export class Inventory {
  private readonly counts = new Map<Item, number>();

  /** @param counts - начальное количество предметов, например восстановленное из сохранения */
  constructor(counts: InventoryCounts = {}) {
    Object.values(Item).forEach((item) => {
      const count = counts[item];
      if (count !== undefined) {
        this.set(item, count);
      }
    });
  }

  /** Возвращает количество предмета или 0, если его нет */
  get(item: Item): number {
    return this.counts.get(item) ?? 0;
  }

  /** Возвращает количество всех предметов, которые есть в инвентаре */
  getAll(): InventoryCounts {
    const counts: InventoryCounts = {};
    this.counts.forEach((count, item) => {
      counts[item] = count;
    });
    return counts;
  }

  /** Устанавливает количество предмета */
  set(item: Item, count: number): void {
    assertCount(count);
    this.write(item, count);
  }

  /** Возвращает, есть ли предмет в инвентаре */
  has(item: Item): boolean {
    return this.get(item) > 0;
  }

  /** Добавляет указанное количество предмета */
  add(item: Item, count: number): void {
    assertCount(count);
    this.write(item, this.get(item) + count);
  }

  /**
   * Отнимает указанное количество предмета, если его хватает. Если не хватает, инвентарь не
   * меняется. Возвращает, удалось ли отнять
   */
  remove(item: Item, count: number): boolean {
    assertCount(count);
    const current = this.get(item);
    if (current < count) {
      return false;
    }

    this.write(item, current - count);
    return true;
  }

  /** Возвращает независимую копию инвентаря */
  clone(): Inventory {
    return new Inventory(this.getAll());
  }

  private write(item: Item, count: number): void {
    if (count === 0) {
      this.counts.delete(item);
    } else {
      this.counts.set(item, count);
    }
  }
}

function assertCount(count: number): void {
  if (!Number.isFinite(count) || count < 0) {
    throw new RangeError(
      `Количество должно быть конечным неотрицательным числом, получено ${count}`
    );
  }
}
