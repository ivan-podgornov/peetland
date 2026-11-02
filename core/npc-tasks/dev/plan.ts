import { Planner } from '@peetland/htn';
import type { PrimitiveTask, Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import { vi } from 'vitest';

/** Составляет план корневой задачи */
export function plan(
  root: Task<NpcState, NpcContext>,
  state: NpcState
): PrimitiveTask<NpcState, NpcContext>[] | null {
  return new Planner<NpcState>().plan(root, state);
}

/** Возвращает названия задач плана или null, если план составить нельзя */
export function planNames(root: Task<NpcState, NpcContext>, state: NpcState): string[] | null {
  const tasks = plan(root, state);

  return tasks && tasks.map((task) => task.name);
}

/** Применяет к состоянию эффекты всех задач плана по очереди */
export function applyPlanEffects(root: Task<NpcState, NpcContext>, state: NpcState): NpcState {
  const tasks = plan(root, state) ?? [];

  return tasks.reduce((current, task) => task.applyEffects(current), state);
}

/**
 * Создаёт заглушку задачи с названием. Если plannable — примитивная задача, которая всегда может
 * выполниться и ничего не меняет, иначе — составная задача без методов, которую нельзя спланировать
 */
export function createStubTask(name: string, plannable = true): Task<NpcState, NpcContext> {
  if (!plannable) {
    return {
      name,
      methods: [],
    };
  }

  return {
    name,
    canExecute: () => true,
    applyEffects: (state) => state,
    start: () => 'success',
    update: () => 'success',
    stop: vi.fn(),
  };
}
