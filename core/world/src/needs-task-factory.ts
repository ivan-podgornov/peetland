import type { CompoundTask } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { ILayerTaskFactory } from './types';

/**
 * Создаёт слой потребностей корневой задачи NPC: то, без чего NPC не может жить. Пока потребностей
 * нет ни у кого, поэтому слой — составная задача без методов, и планировщик переходит к следующему
 * слою
 */
export class NeedsTaskFactory implements ILayerTaskFactory {
  create(): CompoundTask<NpcState, NpcContext> {
    return {
      name: 'needs',
      methods: [],
    };
  }
}
