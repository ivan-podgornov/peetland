import type { IActor } from '@peetland/game';
import type { Inventory } from '@peetland/inventory';

/**
 * Контекст исполнения задач NPC: живые сущности, которым задачи отдают команды в start, update и
 * stop. В состоянии NPC (см. NpcState) этих сущностей нет, только их слепки
 */
export type NpcContext = Readonly<{
  actor: IActor;
  inventory: Inventory;
}>;
