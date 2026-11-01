import type { IGeometry } from '@peetland/geometry';
import type { CompoundTask, Method } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';
import type { PlaceData } from '../places';

import { BuyBoozeTask } from './buy-booze-task';
import { DrinkTask } from './drink-task';
import type { ITaskFactory } from './task-factory';

export type RootTaskOptions = {
  /** Места мира, которыми пользуются NPC */
  places: readonly PlaceData[];
};

export type RootTaskDeps = {
  geometry: IGeometry;
  taskFactory: ITaskFactory;
};

/**
 * Корневая задача NPC: жить. Методы перечислены по приоритету: бухать, а если не получается —
 * купить пойло. Когда что получается, решают предусловия самих задач: бухать можно, если есть
 * пойло, купить — если хватает денег
 */
export class RootTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'live';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: RootTaskOptions, deps: RootTaskDeps) {
    this.methods = [
      {
        name: 'drink',
        preconditions: () => true,
        tasks: [new DrinkTask({ places: options.places }, deps)],
      },
      {
        name: 'buy-booze',
        preconditions: () => true,
        tasks: [new BuyBoozeTask({ places: options.places }, deps)],
      },
    ];
  }
}
