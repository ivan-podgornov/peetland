import type { CompoundTask, Method } from '@peetland/htn';

import type { NpcContext, NpcState } from '@peetland/npc';

import type { IHomelessTaskFactory } from './types';

export type HomelessActivityTaskDeps = {
  homelessTaskFactory: IHomelessTaskFactory;
};

/**
 * Деятельность бомжа: добывать на пойло. Бухает бомж не здесь, а в слое зависимостей, когда тянет.
 * Методы перечислены по приоритету: сдать бутылки, а если не получается — клянчить, а иначе —
 * собирать бутылки. Когда что получается, решают предусловия самих задач: сдать — если за бутылки
 * хватит на пойло, клянчить — если стыд ниже порога, собирать — если NPC унесёт ещё бутылку
 */
export class HomelessActivityTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'earn-for-booze';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: HomelessActivityTaskDeps) {
    const { homelessTaskFactory } = deps;

    this.methods = [
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
