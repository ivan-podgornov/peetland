import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import { Inventory } from '@peetland/inventory';
import type { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

export type InventoryTaskOptions = {
  /** Какой предмет */
  item: Item;
  /** Сколько предмета */
  count: number;
};

/**
 * Мгновенная задача, которая меняет количество предмета в инвентаре из контекста. Завершается
 * прямо в start, поэтому update до неё не доходит, а останавливать нечего
 */
export abstract class InventoryTask implements PrimitiveTask<NpcState, NpcContext> {
  abstract readonly name: string;

  protected readonly item: Item;
  protected readonly count: number;

  constructor(options: InventoryTaskOptions) {
    this.item = options.item;
    this.count = options.count;
  }

  abstract canExecute(state: NpcState): boolean;

  abstract applyEffects(state: NpcState): NpcState;

  abstract start(state: NpcState, context: NpcContext): TaskResult;

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(_state: NpcState, _context: NpcContext): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(_context: NpcContext): void {}

  /** Возвращает количество предмета в состоянии */
  protected getCount(state: NpcState): number {
    return state.inventory[this.item] ?? 0;
  }

  /**
   * Возвращает состояние с новым количеством предмета. Количество меняется в копии инвентаря,
   * поэтому в состоянии действуют те же правила, что и в инвентаре
   */
  protected withCount(state: NpcState, count: number): NpcState {
    const inventory = new Inventory(state.inventory);
    inventory.set(this.item, count);

    return { ...state, inventory: inventory.getAll() };
  }
}
