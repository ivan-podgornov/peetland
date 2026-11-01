import type { CompoundTask } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';

import { RootTask } from './root-task';
import type { RootTaskDeps, RootTaskOptions } from './root-task';

/** Создаёт корневые задачи NPC */
export interface IRootTaskFactory {
  /** Создаёт корневую задачу NPC (см. RootTask) */
  create(options: RootTaskOptions): CompoundTask<NpcState, NpcContext>;
}

export class RootTaskFactory implements IRootTaskFactory {
  private readonly deps: RootTaskDeps;

  constructor(deps: RootTaskDeps) {
    this.deps = deps;
  }

  create(options: RootTaskOptions): RootTask {
    return new RootTask(options, this.deps);
  }
}
