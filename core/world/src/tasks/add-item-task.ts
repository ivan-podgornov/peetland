import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import { Inventory } from '@peetland/inventory';
import type { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

export type AddItemTaskOptions = {
  /** Какой предмет добавить */
  item: Item;
  /** Сколько предмета добавить */
  count: number;
};

/** Добавить предмет в инвентарь. Задача мгновенная: завершается прямо в start */
export class AddItemTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'add-item';

  private readonly options: AddItemTaskOptions;

  constructor(options: AddItemTaskOptions) {
    this.options = options;
  }

  canExecute(_state: NpcState): boolean {
    return true;
  }

  /** Количество предмета в состоянии растёт */
  applyEffects(state: NpcState): NpcState {
    const { item, count } = this.options;
    const inventory = new Inventory(state.inventory);
    inventory.add(item, count);

    return { ...state, inventory: inventory.getAll() };
  }

  /** Добавляет предмет в инвентарь и возвращает 'success' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    const { item, count } = this.options;
    context.inventory.add(item, count);

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(_state: NpcState, _context: NpcContext): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(_context: NpcContext): void {}
}
