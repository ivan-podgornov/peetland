import type { PrimitiveTask, Task } from '../src';
import { Planner } from '../src/planner';

/** Составляет план корневой задачи */
export function plan<TState, TContext>(
  root: Task<TState, TContext>,
  state: TState
): PrimitiveTask<TState, TContext>[] | null {
  return new Planner<TState>().plan(root, state);
}

/** Возвращает названия задач плана или null, если план составить нельзя */
export function planNames<TState, TContext>(
  root: Task<TState, TContext>,
  state: TState
): string[] | null {
  const tasks = plan(root, state);

  return tasks && tasks.map((task) => task.name);
}

/** Применяет к состоянию эффекты всех задач плана по очереди */
export function applyPlanEffects<TState, TContext>(
  root: Task<TState, TContext>,
  state: TState
): TState {
  const tasks = plan(root, state) ?? [];

  return tasks.reduce((current, task) => task.applyEffects(current), state);
}
