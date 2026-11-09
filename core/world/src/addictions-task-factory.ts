import type { CompoundTask } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { ILayerTaskFactory } from './types';

/**
 * Создаёт слой зависимостей корневой задачи NPC: то, без чего NPC жить не хочет. Пока зависимостей
 * нет ни у кого, поэтому слой — составная задача без методов, и планировщик переходит к следующему
 * слою
 */
export class AddictionsTaskFactory implements ILayerTaskFactory {
  create(): CompoundTask<NpcState, NpcContext> {
    return {
      name: 'addictions',
      methods: [],
    };
  }
}
