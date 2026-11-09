import type { CompoundTask } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { ILayerTaskFactory } from './types';

/**
 * Создаёт слой хобби корневой задачи NPC: то, чем NPC занимается для души. Пока хобби нет ни у
 * кого, поэтому слой — составная задача без методов, и планировщик переходит к следующему слою
 */
export class HobbiesTaskFactory implements ILayerTaskFactory {
  create(): CompoundTask<NpcState, NpcContext> {
    return {
      name: 'hobbies',
      methods: [],
    };
  }
}
