import type { CompoundTask, Method } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';
import type { IPlaces } from '../places';

import type { ITaskFactory } from './task-factory';

export type RootTaskOptions = {
  /** Места мира, которыми пользуются NPC */
  places: IPlaces;
};

export type RootTaskDeps = {
  taskFactory: ITaskFactory;
};

/**
 * Корневая задача NPC: жить. Методы перечислены по приоритету: бухать, а если не получается —
 * купить пойло, а если и это не получается — сдать бутылки. Когда что получается, решают
 * предусловия самих задач: бухать можно, если есть пойло, купить — если хватает денег, сдать —
 * если есть бутылки
 */
export class RootTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'live';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: RootTaskOptions, deps: RootTaskDeps) {
    const { taskFactory } = deps;

    this.methods = [
      {
        name: 'drink',
        preconditions: () => true,
        tasks: [taskFactory.drink({ places: options.places })],
      },
      {
        name: 'buy-booze',
        preconditions: () => true,
        tasks: [taskFactory.buyBooze({ places: options.places })],
      },
      {
        name: 'sell-bottles',
        preconditions: () => true,
        tasks: [taskFactory.sellBottles({ places: options.places })],
      },
    ];
  }
}
