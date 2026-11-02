import { vi } from 'vitest';

import type { PrimitiveTask, Task } from '../src';

/** Создаёт примитивную задачу с названием, которая всегда может выполниться и ничего не меняет */
export function createStubPrimitiveTask<TState, TContext>(
  name: string
): PrimitiveTask<TState, TContext> {
  return {
    name,
    canExecute: () => true,
    applyEffects: (state) => state,
    start: () => 'success',
    update: () => 'success',
    stop: vi.fn(),
  };
}

/**
 * Создаёт заглушку задачи с названием. Если plannable — примитивная задача, которая всегда может
 * выполниться и ничего не меняет (см. createStubPrimitiveTask), иначе — составная задача без
 * методов, которую нельзя спланировать
 */
export function createStubTask<TState, TContext>(
  name: string,
  plannable = true
): Task<TState, TContext> {
  if (!plannable) {
    return {
      name,
      methods: [],
    };
  }

  return createStubPrimitiveTask(name);
}
