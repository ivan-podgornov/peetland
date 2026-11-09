import { NeedsTask } from './needs-task';
import type { ILayerTaskFactory } from './types';

/** Создаёт слой потребностей корневой задачи NPC (см. NeedsTask) */
export class NeedsTaskFactory implements ILayerTaskFactory {
  create(): NeedsTask {
    return new NeedsTask();
  }
}
