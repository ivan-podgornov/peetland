import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

import type { ITaskFactory } from './task-factory';

/** Сколько NPC пьёт одну бутылку пойла, в миллисекундах */
export const DRINK_DURATION = 10000;

export type DrinkTaskDeps = {
  taskFactory: ITaskFactory;
};

/** Бухать: выпить бутылку пойла, если оно есть. Пойло отнимается, только когда NPC допил */
export class DrinkTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'drink';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: DrinkTaskDeps) {
    const { taskFactory } = deps;

    this.methods = [
      {
        name: 'drink-standing',
        preconditions: (state) => (state.inventory[Item.Booze] ?? 0) > 0,
        tasks: [
          taskFactory.playAnimation({ animation: 'drink-standing-1', duration: DRINK_DURATION }),
          taskFactory.removeItem({ item: Item.Booze, count: 1 }),
        ],
      },
    ];
  }
}
