import { InMemoryRepository } from '@peetland/repository';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { INpcFactory, IPlacesFactory, NpcData, PlaceData, WorldDeps } from '../../src';
import { Npc } from '../../src';
import { createNpcDeps } from '../npc/helpers';
import { createMockedPlaces } from '../places/helpers';

/** Создаёт фабрику NPC, которая создаёт NPC по данным с незначимыми зависимостями */
export function createMockedNpcFactory(): Mocked<INpcFactory> {
  return { create: vi.fn((data: NpcData) => new Npc(data, createNpcDeps())) };
}

/** Создаёт фабрику мест, которая всегда возвращает переданные запросы к местам */
export function createMockedPlacesFactory(places = createMockedPlaces()): Mocked<IPlacesFactory> {
  return { create: vi.fn(() => places) };
}

export type CreateWorldDepsOptions = {
  npcs?: NpcData[];
  places?: PlaceData[];
  placesFactory?: IPlacesFactory;
  npcFactory?: INpcFactory;
};

/**
 * Создаёт зависимости мира с репозиториями в памяти. То, что не передано, заполняется незначимыми
 * значениями: NPC и мест нет, фабрики мест и NPC — моки
 */
export function createWorldDeps(options: CreateWorldDepsOptions = {}): WorldDeps {
  return {
    npcs: new InMemoryRepository(options.npcs ?? []),
    places: new InMemoryRepository(options.places ?? []),
    placesFactory: options.placesFactory ?? createMockedPlacesFactory(),
    npcFactory: options.npcFactory ?? createMockedNpcFactory(),
  };
}
