import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import { vi } from 'vitest';

/** Создаёт фабрику корневых задач, которая всегда возвращает переданную задачу */
export function createMockedRootTaskFactory(
  task: Task<NpcState, NpcContext> = {
    name: 'root',
    methods: [],
  }
) {
  return { create: vi.fn(() => task) };
}
