import { HobbiesTask } from './hobbies-task';
import type { ILayerTaskFactory } from './types';

/** Создаёт слой хобби корневой задачи NPC (см. HobbiesTask) */
export class HobbiesTaskFactory implements ILayerTaskFactory {
  create(): HobbiesTask {
    return new HobbiesTask();
  }
}
