import type { CompoundTask, Method } from '@peetland/htn';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { INeedsTaskFactory } from './types';

export type NeedsTaskDeps = {
  /** Фабрика, которой задача создаёт задачи удовлетворения каждой потребности */
  needsTaskFactory: INeedsTaskFactory;
};

/**
 * Удовлетворить срочные потребности. Методы — жизненные потребности в порядке приоритета: если
 * срочных несколько, первой удовлетворяется та, что выше. Метод подходит, если его потребность
 * срочная. Если удовлетворить её нечем, планировщик переходит к следующей срочной, а если срочных
 * нет, задачу не спланировать
 */
export class NeedsTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'needs';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: NeedsTaskDeps) {
    const { needsTaskFactory } = deps;

    this.methods = [
      {
        name: 'satisfy-hunger',
        preconditions: (state) => state.self.needs.isUrgent(Need.Satiety, state.world.time),
        tasks: [needsTaskFactory.satisfyHunger()],
      },
    ];
  }
}
