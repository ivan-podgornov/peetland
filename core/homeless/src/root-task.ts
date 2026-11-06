import type { CompoundTask, Method } from '@peetland/htn';

import type { NpcContext, NpcState } from '@peetland/npc';

import type { IHomelessTaskFactory } from './types';

export type HomelessRootTaskDeps = {
  homelessTaskFactory: IHomelessTaskFactory;
};

/**
 * Корневая задача бомжа: жить. Методы перечислены по приоритету: бухать, а если не получается —
 * купить пойло, а если и это не получается — сдать бутылки, а если и это не получается — клянчить, а
 * иначе — собирать бутылки. Когда что получается, решают предусловия самих задач: бухать можно,
 * если есть пойло, купить — если хватает денег, сдать — если за бутылки хватит на пойло, клянчить —
 * если стыд ниже порога, собирать — если NPC унесёт ещё бутылку
 */
export class HomelessRootTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'live';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: HomelessRootTaskDeps) {
    const { homelessTaskFactory } = deps;

    this.methods = [
      {
        name: 'drink',
        preconditions: () => true,
        tasks: [homelessTaskFactory.drink()],
      },
      {
        name: 'buy-booze',
        preconditions: () => true,
        tasks: [homelessTaskFactory.buyBooze()],
      },
      {
        name: 'sell-bottles',
        preconditions: () => true,
        tasks: [homelessTaskFactory.sellBottles()],
      },
      {
        name: 'beg',
        preconditions: () => true,
        tasks: [homelessTaskFactory.beg()],
      },
      {
        name: 'collect-bottles',
        preconditions: () => true,
        tasks: [homelessTaskFactory.collectBottles()],
      },
    ];
  }
}
