import { Geometry } from '@peetland/geometry';
import { createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { INeedsTaskFactory, NeedsTaskFactoryDeps } from '../src';

/**
 * Создаёт фабрику задач удовлетворения потребностей. Задачи, которые не переданы, — заглушки,
 * которые всегда можно выполнить (см. createStubTask)
 */
export function createMockedNeedsTaskFactory(
  factory: Partial<INeedsTaskFactory> = {}
): Mocked<INeedsTaskFactory> {
  return {
    satisfyNeeds: vi.fn(() => createStubTask<NpcState, NpcContext>('needs')),
    satisfyHunger: vi.fn(() => createStubTask<NpcState, NpcContext>('satisfy-hunger')),
    stockFood: vi.fn(() => createStubTask<NpcState, NpcContext>('stock-food')),
    buyFood: vi.fn(() => createStubTask<NpcState, NpcContext>('buy-food')),
    ...factory,
  } as Mocked<INeedsTaskFactory>;
}

/** Создаёт зависимости фабрики задач удовлетворения потребностей. Мест в мире нет */
export function createNeedsTaskFactoryDeps(
  deps: Partial<NeedsTaskFactoryDeps> = {}
): NeedsTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    places: createMockedPlaces(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
    ...deps,
  };
}
