import type { IActor } from '@peetland/game';
import type { Inventory } from '@peetland/inventory';
import type { INeeds } from '@peetland/needs';
import type { IPsyche } from '@peetland/psyche';

/**
 * Контекст исполнения задач NPC: живые сущности, которым задачи отдают команды в start, update и
 * stop. В состоянии NPC (см. NpcState) задачи их только читают, а меняют через контекст
 */
export type NpcContext = Readonly<{
  actor: IActor;
  inventory: Inventory;
  /** Психика, которой задачи сообщают о поступках NPC */
  psyche: IPsyche;
  /** Потребности, которым задачи сообщают о занятиях NPC */
  needs: INeeds;
}>;
