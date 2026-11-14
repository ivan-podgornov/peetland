import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

import { SatisfyHungerTask } from './satisfy-hunger-task';
import { SatisfyNeedsTask } from './satisfy-needs-task';
import type { ISatisfyNeedsTaskFactory } from './types';

/** Создаёт задачи удовлетворения потребностей. На каждый вызов задача новая */
export class SatisfyNeedsTaskFactory implements ISatisfyNeedsTaskFactory {
  satisfyNeeds(): Task<NpcState, NpcContext> {
    return new SatisfyNeedsTask({ satisfyNeedsTaskFactory: this });
  }

  satisfyHunger(): Task<NpcState, NpcContext> {
    return new SatisfyHungerTask();
  }
}
