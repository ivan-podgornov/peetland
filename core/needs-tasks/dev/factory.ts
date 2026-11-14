import { createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { ISatisfyNeedsTaskFactory } from '../src';

/**
 * Создаёт фабрику задач удовлетворения потребностей. Задачи, которые не переданы, — заглушки,
 * которые всегда можно выполнить (см. createStubTask)
 */
export function createMockedSatisfyNeedsTaskFactory(
  factory: Partial<ISatisfyNeedsTaskFactory> = {}
): Mocked<ISatisfyNeedsTaskFactory> {
  return {
    satisfyNeeds: vi.fn(() => createStubTask<NpcState, NpcContext>('satisfy-needs')),
    satisfyHunger: vi.fn(() => createStubTask<NpcState, NpcContext>('satisfy-hunger')),
    ...factory,
  } as Mocked<ISatisfyNeedsTaskFactory>;
}
