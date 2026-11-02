import type { Task } from '@peetland/htn';

import type { NpcContext } from './context';
import type { NpcKind } from './kind';
import type { NpcState } from './state';

/**
 * Создаёт корневые задачи, которые планируют HTN-агенты NPC. NPC объявляет, какая фабрика ему
 * нужна, а реализуют её задачи, поэтому NPC не зависит от задач
 */
export interface IRootTaskFactory {
  /** Создаёт корневую задачу NPC */
  create(): Task<NpcState, NpcContext>;
}

/** Фабрика корневой задачи для каждого типа NPC */
export type RootTaskFactories = Readonly<Record<NpcKind, IRootTaskFactory>>;
