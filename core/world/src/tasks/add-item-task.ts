import type { TaskResult } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';

import { InventoryTask } from './inventory-task';

/** Добавить предмет в инвентарь */
export class AddItemTask extends InventoryTask {
  readonly name = 'add-item';

  canExecute(_state: NpcState): boolean {
    return true;
  }

  /** Количество предмета в состоянии растёт */
  applyEffects(state: NpcState): NpcState {
    return this.withCount(state, this.getCount(state) + this.count);
  }

  /** Добавляет предмет в инвентарь и возвращает 'success' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    context.inventory.add(this.item, this.count);

    return 'success';
  }
}
