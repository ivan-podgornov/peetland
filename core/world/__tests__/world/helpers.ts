import { InMemoryRepository } from '@peetland/repository';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { INpcFactory, NpcData, PlaceData, WorldDeps } from '../../src';
import { Npc } from '../../src';
import { createNpcDeps } from '../npc/helpers';

/** Создаёт фабрику NPC, которая создаёт NPC по данным с незначимыми зависимостями */
export function createMockedNpcFactory(): Mocked<INpcFactory> {
  return { create: vi.fn((data: NpcData) => new Npc(data, createNpcDeps())) };
}

export type CreateWorldDepsOptions = {
  npcs?: NpcData[];
  places?: PlaceData[];
  npcFactory?: INpcFactory;
};

/**
 * Создаёт зависимости мира с репозиториями в памяти. То, что не передано, заполняется незначимыми
 * значениями: NPC и мест нет, фабрика NPC — мок
 */
export function createWorldDeps(options: CreateWorldDepsOptions = {}): WorldDeps {
  return {
    npcs: new InMemoryRepository(options.npcs ?? []),
    places: new InMemoryRepository(options.places ?? []),
    npcFactory: options.npcFactory ?? createMockedNpcFactory(),
  };
}
