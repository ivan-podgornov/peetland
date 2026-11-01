import type { CompoundTask, Method } from '@peetland/htn';
import type { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

import type { ITaskFactory } from './task-factory';

export type PickUpTaskOptions = {
  /** Какой предмет взять */
  item: Item;
  /** Сколько предмета взять */
  count: number;
};

export type PickUpTaskDeps = {
  taskFactory: ITaskFactory;
};

/** Взять предмет даром, например, находку. Предмет добавляется, только когда анимация закончилась */
export class PickUpTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'pick-up';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: PickUpTaskOptions, deps: PickUpTaskDeps) {
    const { item, count } = options;
    const { taskFactory } = deps;

    this.methods = [
      {
        name: 'take',
        preconditions: () => true,
        tasks: [
          taskFactory.playAnimation({ animation: 'item-receive' }),
          taskFactory.addItem({ item, count }),
        ],
      },
    ];
  }
}
