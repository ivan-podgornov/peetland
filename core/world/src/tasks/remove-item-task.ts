import type { TaskResult } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';

import { InventoryTask } from './inventory-task';

/** Отнять предмет из инвентаря. Выполнить можно, только если предмета хватает */
export class RemoveItemTask extends InventoryTask {
  readonly name = 'remove-item';

  canExecute(state: NpcState): boolean {
    return this.getCount(state) >= this.count;
  }

  /** Количество предмета в состоянии уменьшается */
  applyEffects(state: NpcState): NpcState {
    return this.withCount(state, this.getCount(state) - this.count);
  }

  /** Отнимает предмет из инвентаря. Если предмета не хватило, возвращает 'failed' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    return context.inventory.remove(this.item, this.count) ? 'success' : 'failed';
  }
}
