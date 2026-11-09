import type { CompoundTask, Method } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

/**
 * Слой зависимостей корневой задачи NPC: то, без чего NPC жить не хочет. Пока зависимостей нет ни у
 * кого, поэтому методов нет, и планировщик переходит к следующему слою
 */
export class AddictionsTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'addictions';

  readonly methods: Method<NpcState, NpcContext>[] = [];
}
