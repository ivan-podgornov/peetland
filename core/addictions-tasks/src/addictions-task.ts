import { Addiction, AddictionStatus } from '@peetland/addictions';
import type { CompoundTask, Method } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { IAddictionsTaskFactory } from './types';

export type AddictionsTaskDeps = {
  /** Фабрика, которой задача создаёт задачи удовлетворения каждой зависимости */
  addictionsTaskFactory: IAddictionsTaskFactory;
};

/**
 * Удовлетворить зависимости. Метод подходит, если его зависимость тянет (AddictionStatus.Craving),
 * и планирует её удовлетворение. Если удовлетворить нечем или ничего не тянет, задачу не
 * спланировать
 */
export class AddictionsTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'addictions';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: AddictionsTaskDeps) {
    const { addictionsTaskFactory } = deps;

    this.methods = [
      {
        name: 'satisfy-alcoholism',
        preconditions: (state) =>
          state.self.addictions.getStatus(Addiction.Alcoholism, state.world.time) ===
          AddictionStatus.Craving,
        tasks: [addictionsTaskFactory.satisfyAlcoholism()],
      },
    ];
  }
}
