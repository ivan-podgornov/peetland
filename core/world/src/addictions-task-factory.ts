import { AddictionsTask } from './addictions-task';
import type { ILayerTaskFactory } from './types';

/** Создаёт слой зависимостей корневой задачи NPC (см. AddictionsTask) */
export class AddictionsTaskFactory implements ILayerTaskFactory {
  create(): AddictionsTask {
    return new AddictionsTask();
  }
}
