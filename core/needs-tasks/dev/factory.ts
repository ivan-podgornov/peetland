import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { ISatisfyNeedTaskFactory } from '../src';

/** Создаёт фабрику, которая на любую потребность возвращает переданную задачу */
export function createMockedSatisfyNeedTaskFactory(
  task: Task<NpcState, NpcContext>
): Mocked<ISatisfyNeedTaskFactory> {
  return { create: vi.fn(() => task) };
}
