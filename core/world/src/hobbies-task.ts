import type { CompoundTask, Method } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

/**
 * Слой хобби корневой задачи NPC: то, чем NPC занимается для души. Пока хобби нет ни у кого,
 * поэтому методов нет, и планировщик переходит к следующему слою
 */
export class HobbiesTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'hobbies';

  readonly methods: Method<NpcState, NpcContext>[] = [];
}
