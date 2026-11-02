import type { INpcFactory, NpcData } from '@peetland/npc';
import { createMockedNpcFactory } from '@peetland/npc/dev';
import { InMemoryRepository } from '@peetland/repository';

import type { WorldDeps } from '../../src';

export type CreateWorldDepsOptions = {
  npcs?: NpcData[];
  npcFactory?: INpcFactory;
};

/**
 * Создаёт зависимости мира с репозиторием в памяти. То, что не передано, заполняется незначимыми
 * значениями: NPC нет, фабрика NPC — мок
 */
export function createWorldDeps(options: CreateWorldDepsOptions = {}): WorldDeps {
  return {
    npcs: new InMemoryRepository(options.npcs ?? []),
    npcFactory: options.npcFactory ?? createMockedNpcFactory(),
  };
}
