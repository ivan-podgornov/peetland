import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

import { NeedsTask } from './needs-task';
import { SatisfyHungerTask } from './satisfy-hunger-task';
import type { INeedsTaskFactory } from './types';

/** Создаёт задачи удовлетворения потребностей. На каждый вызов задача новая */
export class NeedsTaskFactory implements INeedsTaskFactory {
  satisfyNeeds(): Task<NpcState, NpcContext> {
    return new NeedsTask({ needsTaskFactory: this });
  }

  satisfyHunger(): Task<NpcState, NpcContext> {
    return new SatisfyHungerTask();
  }
}
