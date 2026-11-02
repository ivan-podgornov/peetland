import type { IKindRootTaskFactory } from '@peetland/npc';

import { HomelessRootTask } from './root-task';
import type { HomelessRootTaskDeps } from './root-task';

/** Создаёт корневые задачи бомжа (см. HomelessRootTask) */
export class HomelessRootTaskFactory implements IKindRootTaskFactory {
  private readonly deps: HomelessRootTaskDeps;

  constructor(deps: HomelessRootTaskDeps) {
    this.deps = deps;
  }

  create(): HomelessRootTask {
    return new HomelessRootTask(this.deps);
  }
}
