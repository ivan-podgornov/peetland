import type { IRootTaskFactory } from '@peetland/npc';

import { HomelessRootTask } from './root-task';
import type { HomelessRootTaskDeps, HomelessRootTaskOptions } from './root-task';

/** Создаёт корневые задачи бомжа (см. HomelessRootTask) */
export class HomelessRootTaskFactory implements IRootTaskFactory {
  private readonly deps: HomelessRootTaskDeps;

  constructor(deps: HomelessRootTaskDeps) {
    this.deps = deps;
  }

  create(options: HomelessRootTaskOptions): HomelessRootTask {
    return new HomelessRootTask(options, this.deps);
  }
}
