import { Geometry } from '@peetland/geometry';
import { createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { AddictionsTaskFactoryDeps, IAddictionsTaskFactory } from '../src';

/**
 * Создаёт фабрику задач удовлетворения зависимостей. Задачи, которые не переданы, — заглушки,
 * которые всегда можно выполнить (см. createStubTask)
 */
export function createMockedAddictionsTaskFactory(
  factory: Partial<IAddictionsTaskFactory> = {}
): Mocked<IAddictionsTaskFactory> {
  return {
    satisfyAddictions: vi.fn(() => createStubTask<NpcState, NpcContext>('addictions')),
    satisfyAlcoholism: vi.fn(() => createStubTask<NpcState, NpcContext>('satisfy-alcoholism')),
    buyBooze: vi.fn(() => createStubTask<NpcState, NpcContext>('buy-booze')),
    ...factory,
  } as Mocked<IAddictionsTaskFactory>;
}

/** Создаёт зависимости фабрики задач удовлетворения зависимостей. Мест в мире нет */
export function createAddictionsTaskFactoryDeps(
  deps: Partial<AddictionsTaskFactoryDeps> = {}
): AddictionsTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    places: createMockedPlaces(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
    ...deps,
  };
}
