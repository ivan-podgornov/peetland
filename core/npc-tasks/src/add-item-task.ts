import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '@peetland/npc';

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

  canExecute(): boolean {
    return true;
  }

  /** Количество предмета растёт в копии инвентаря из состояния */
  applyEffects(state: NpcState): NpcState {
    const { item, count } = this.options;
    const inventory = state.self.inventory.clone();
    inventory.add(item, count);

    return {
      ...state,
      self: {
        ...state.self,
        inventory,
      },
    };
  }

  /** Добавляет предмет в инвентарь и возвращает 'success' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    const { item, count } = this.options;
    context.inventory.add(item, count);

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
