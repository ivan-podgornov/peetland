import type { Task } from '@peetland/htn';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';

import { SatisfyHungerTask } from './satisfy-hunger-task';

export interface ISatisfyNeedTaskFactory {
  /**
   * Создаёт задачу, которая удовлетворяет потребность. Задача одинаковая для всех типов NPC
   * @param need - потребность
   */
  create(need: Need): Task<NpcState, NpcContext>;
}

/** Создаёт задачи удовлетворения потребностей: для сытости — SatisfyHungerTask */
export class SatisfyNeedTaskFactory implements ISatisfyNeedTaskFactory {
  create(need: Need): Task<NpcState, NpcContext> {
    switch (need) {
      case Need.Satiety:
        return new SatisfyHungerTask();
    }
  }
}
