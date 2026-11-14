import type { Task } from '@peetland/htn';
import { SatisfyNeedsTaskFactory } from '@peetland/needs-tasks';
import type { ISatisfyNeedsTaskFactory } from '@peetland/needs-tasks';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { ILayerTaskFactory } from './types';

export type NeedsTaskFactoryDeps = {
  /** Фабрика задач удовлетворения потребностей. По умолчанию — SatisfyNeedsTaskFactory */
  satisfyNeedsTaskFactory?: ISatisfyNeedsTaskFactory;
};

/**
 * Создаёт слой потребностей корневой задачи NPC: задачу удовлетворить срочные потребности
 * (SatisfyNeedsTask из @peetland/needs-tasks). Задачи удовлетворения одинаковые для всех типов NPC,
 * поэтому тип NPC слою не нужен
 */
export class NeedsTaskFactory implements ILayerTaskFactory {
  private readonly satisfyNeedsTaskFactory: ISatisfyNeedsTaskFactory;

  constructor(deps: NeedsTaskFactoryDeps = {}) {
    const { satisfyNeedsTaskFactory = new SatisfyNeedsTaskFactory() } = deps;

    this.satisfyNeedsTaskFactory = satisfyNeedsTaskFactory;
  }

  create(): Task<NpcState, NpcContext> {
    return this.satisfyNeedsTaskFactory.satisfyNeeds();
  }
}
