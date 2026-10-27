import type { Item } from './item';

/**
 * Хранит количество каждого предмета. Количество — целое неотрицательное число. Предметы с нулевым
 * количеством не хранятся
 */
export class Inventory {
  private readonly counts = new Map<Item, number>();

  /** Возвращает количество предмета или 0, если его нет */
  get(item: Item): number {
    return this.counts.get(item) ?? 0;
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
    const copy = new Inventory();
    this.counts.forEach((count, item) => copy.set(item, count));
    return copy;
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
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(`Количество должно быть целым неотрицательным числом, получено ${count}`);
  }
}
