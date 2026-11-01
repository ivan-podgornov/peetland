import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import { Inventory } from '@peetland/inventory';
import type { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

export type RemoveItemTaskOptions = {
  /** Какой предмет отнять */
  item: Item;
  /** Сколько предмета отнять */
  count: number;
};

/**
 * Отнять предмет из инвентаря. Выполнить можно, только если предмета хватает. Задача мгновенная:
 * завершается прямо в start
 */
export class RemoveItemTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'remove-item';

  private readonly options: RemoveItemTaskOptions;

  constructor(options: RemoveItemTaskOptions) {
    this.options = options;
  }

  canExecute(state: NpcState): boolean {
    const { item, count } = this.options;

    return (state.inventory[item] ?? 0) >= count;
  }

  /** Количество предмета в состоянии уменьшается */
  applyEffects(state: NpcState): NpcState {
    const { item, count } = this.options;
    const inventory = new Inventory(state.inventory);
    inventory.remove(item, count);

    return { ...state, inventory: inventory.getAll() };
  }

  /** Отнимает предмет из инвентаря. Если предмета не хватило, возвращает 'failed' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    const { item, count } = this.options;

    return context.inventory.remove(item, count) ? 'success' : 'failed';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(_state: NpcState, _context: NpcContext): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(_context: NpcContext): void {}
}
