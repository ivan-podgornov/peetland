import { SatisfyNeedTaskFactory } from '@peetland/needs-tasks';
import type { ISatisfyNeedTaskFactory } from '@peetland/needs-tasks';

import { NeedsTask } from './needs-task';
import type { ILayerTaskFactory } from './types';

export type NeedsTaskFactoryDeps = {
  /** Фабрика задач, которые удовлетворяют потребности. По умолчанию — SatisfyNeedTaskFactory */
  satisfyNeedTaskFactory?: ISatisfyNeedTaskFactory;
};

/**
 * Создаёт слой потребностей корневой задачи NPC (см. NeedsTask). Задачи удовлетворения одинаковые
 * для всех типов NPC, поэтому тип NPC слою не нужен
 */
export class NeedsTaskFactory implements ILayerTaskFactory {
  private readonly satisfyNeedTaskFactory: ISatisfyNeedTaskFactory;

  constructor(deps: NeedsTaskFactoryDeps = {}) {
    const { satisfyNeedTaskFactory = new SatisfyNeedTaskFactory() } = deps;

    this.satisfyNeedTaskFactory = satisfyNeedTaskFactory;
  }

  create(): NeedsTask {
    const { satisfyNeedTaskFactory } = this;

    return new NeedsTask({ satisfyNeedTaskFactory });
  }
}
