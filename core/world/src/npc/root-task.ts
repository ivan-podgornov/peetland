import type { IActor } from '@peetland/game';
import type { Task } from '@peetland/htn';

import type { NpcState } from './state';

export interface INpcRootTaskFactory {
  /** Создаёт корневую задачу NPC. Задачи отдают команды переданному актору */
  create(actor: IActor): Task<NpcState>;
}
