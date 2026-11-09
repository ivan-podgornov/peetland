import type { Task } from '@peetland/htn';
import type { NpcContext, NpcKind, NpcState } from '@peetland/npc';

/** Создаёт один слой корневой задачи NPC (см. RootTask) */
export interface ILayerTaskFactory {
  /**
   * Создаёт дерево задач слоя для одного NPC указанного типа. Дерево не делится между NPC: каждому
   * NPC создаётся своё
   */
  create(kind: NpcKind): Task<NpcState, NpcContext>;
}
