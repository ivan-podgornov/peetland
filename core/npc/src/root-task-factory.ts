import type { Task } from '@peetland/htn';

import type { NpcContext } from './context';
import type { NpcKind } from './kind';
import type { NpcState } from './state';

/**
 * Создаёт корневые задачи, которые планируют HTN-агенты NPC. NPC объявляет, какая фабрика ему
 * нужна, а реализуют её задачи, поэтому NPC не зависит от задач
 */
export interface IRootTaskFactory {
  /**
   * Создаёт дерево задач для одного NPC указанного типа. Дерево не делится между NPC: каждому NPC
   * создаётся своё
   */
  create(kind: NpcKind): Task<NpcState, NpcContext>;
}

/** Создаёт корневые задачи NPC одного типа. Реализует её пакет с задачами этого типа */
export interface IKindRootTaskFactory {
  /** Создаёт дерево задач для одного NPC. Дерево не делится между NPC: каждому NPC создаётся своё */
  create(): Task<NpcState, NpcContext>;
}
