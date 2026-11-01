import { createControlledObservable } from '@peetland/events/dev';
import type { IGame } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import { InMemoryRepository } from '@peetland/repository';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';

import type { NpcData, PlaceData, WorldDeps } from '../../src';

/** Создаёт игру. Части игры, которые не переданы, заполняются незначимыми моками */
export function createGame(game: Partial<IGame> = {}): IGame {
  return {
    actorFactory: createMockedActorFactory(),
    geometry: new Geometry(),
    objectFactory: { create: vi.fn() },
    ...game,
  };
}

export type CreateWorldDepsOptions = {
  game?: IGame;
  npcs?: NpcData[];
  places?: PlaceData[];
  frames?: WorldDeps['frames'];
};

/**
 * Создаёт зависимости мира с репозиториями в памяти. То, что не передано, заполняется незначимыми
 * значениями: NPC и мест нет, кадры не идут
 */
export function createWorldDeps(options: CreateWorldDepsOptions = {}): WorldDeps {
  return {
    game: options.game ?? createGame(),
    npcs: new InMemoryRepository(options.npcs ?? []),
    places: new InMemoryRepository(options.places ?? []),
    frames: options.frames ?? createControlledObservable().observable,
  };
}
