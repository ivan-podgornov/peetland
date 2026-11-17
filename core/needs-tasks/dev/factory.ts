import { createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { INeedsTaskFactory } from '../src';

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
    ...factory,
  } as Mocked<INeedsTaskFactory>;
}
