import type { CompoundTask, Method } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

/**
 * Слой потребностей корневой задачи NPC: то, без чего NPC не может жить. Пока потребностей нет ни у
 * кого, поэтому методов нет, и планировщик переходит к следующему слою
 */
export class NeedsTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'needs';

  readonly methods: Method<NpcState, NpcContext>[] = [];
}
