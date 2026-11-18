import type { CompoundTask, Method } from '@peetland/htn';
import { Need, NeedStatus } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { INeedsTaskFactory } from './types';

export type NeedsTaskDeps = {
  /** Фабрика, которой задача создаёт задачи удовлетворения каждой потребности */
  needsTaskFactory: INeedsTaskFactory;
};

/**
 * Удовлетворить потребности. Методы в порядке приоритета: сначала срочные потребности — метод
 * подходит, если его потребность срочная, — а затем запасы на будущее: обзавестись жратвой, если
 * сытость не спокойная. Если удовлетворить потребность нечем, планировщик переходит к следующему
 * методу, а если не подходит ни один, задачу не спланировать
 */
export class NeedsTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'needs';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: NeedsTaskDeps) {
    const { needsTaskFactory } = deps;

    this.methods = [
      {
        name: 'satisfy-hunger',
        preconditions: (state) =>
          state.self.needs.getStatus(Need.Satiety, state.world.time) === NeedStatus.Urgent,
        tasks: [needsTaskFactory.satisfyHunger()],
      },
      {
        name: 'stock-food',
        preconditions: (state) =>
          state.self.needs.getStatus(Need.Satiety, state.world.time) !== NeedStatus.Calm,
        tasks: [needsTaskFactory.stockFood()],
      },
    ];
  }
}
