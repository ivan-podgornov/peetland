import type { IRootTaskFactory } from '../npc';

import { RootTask } from './root-task';
import type { RootTaskDeps, RootTaskOptions } from './root-task';

/** Создаёт корневые задачи NPC (см. RootTask) */
export class RootTaskFactory implements IRootTaskFactory {
  private readonly deps: RootTaskDeps;

  constructor(deps: RootTaskDeps) {
    this.deps = deps;
  }

  create(options: RootTaskOptions): RootTask {
    return new RootTask(options, this.deps);
  }
}
