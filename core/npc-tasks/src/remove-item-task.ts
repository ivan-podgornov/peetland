import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '@peetland/npc';

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

    return state.self.inventory.get(item) >= count;
  }

  /** Количество предмета уменьшается в копии инвентаря из состояния */
  applyEffects(state: NpcState): NpcState {
    const { item, count } = this.options;
    const inventory = state.self.inventory.clone();
    inventory.remove(item, count);

    return {
      ...state,
      self: {
        ...state.self,
        inventory,
      },
    };
  }

  /** Отнимает предмет из инвентаря. Если предмета не хватило, возвращает 'failed' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    const { item, count } = this.options;

    return context.inventory.remove(item, count) ? 'success' : 'failed';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
