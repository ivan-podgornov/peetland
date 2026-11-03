import { createControlledObservable } from '@peetland/events/dev';
import type { IGame } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { NpcData } from '@peetland/npc';
import type { PlaceData } from '@peetland/places';
import { InMemoryRepository } from '@peetland/repository';
import { ManualTime } from '@peetland/timings';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';

import type { WorldOptions } from '../src';

/** Создаёт игру с виртуальными акторами и ручным временем. Кадры не идут, а объекты создавать нельзя */
export function createGame(game: Partial<IGame> = {}): IGame {
  return {
    actorFactory: createMockedActorFactory(),
    time: new ManualTime(),
    geometry: new Geometry(),
    objectFactory: {
      create: vi.fn(() => {
        throw new Error('Мир не создаёт объекты');
      }),
    },
    frames: createControlledObservable().observable,
    ...game,
  };
}

export type CreateWorldOptionsOptions = {
  game?: IGame;
  npcs?: NpcData[];
  places?: PlaceData[];
};

/**
 * Создаёт опции мира с репозиториями в памяти. То, что не передано, заполняется незначимыми
 * значениями: NPC и мест нет, игра — с виртуальными акторами
 */
export function createWorldOptions(options: CreateWorldOptionsOptions = {}): WorldOptions {
  return {
    game: options.game ?? createGame(),
    npcs: new InMemoryRepository(options.npcs ?? []),
    places: new InMemoryRepository(options.places ?? []),
  };
}
