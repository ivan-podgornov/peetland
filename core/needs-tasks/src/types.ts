import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

/** Создаёт задачи удовлетворения потребностей. Задачи одинаковые для всех типов NPC */
export interface ISatisfyNeedsTaskFactory {
  /** Создаёт задачу удовлетворить срочные потребности (см. SatisfyNeedsTask) */
  satisfyNeeds(): Task<NpcState, NpcContext>;
  /** Создаёт задачу утолить голод (см. SatisfyHungerTask) */
  satisfyHunger(): Task<NpcState, NpcContext>;
}
