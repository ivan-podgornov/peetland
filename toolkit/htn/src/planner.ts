import { isPrimitive } from './task';
import type { PrimitiveTask, Task } from './task';

/** Планировщик работает только с состоянием и о контексте исполнения задач не знает */
export interface IPlanner<TState> {
  plan<TContext>(
    root: Task<TState, TContext>,
    state: TState
  ): PrimitiveTask<TState, TContext>[] | null;
}

export class Planner<TState> implements IPlanner<TState> {
  plan<TContext>(
    root: Task<TState, TContext>,
    state: TState
  ): PrimitiveTask<TState, TContext>[] | null {
    return this.decompose([root], state);
  }

  private decompose<TContext>(
    tasks: Task<TState, TContext>[],
    state: TState
  ): PrimitiveTask<TState, TContext>[] | null {
    const [head, ...tail] = tasks;

    if (!head) {
      return [];
    }

    if (isPrimitive(head)) {
      if (!head.canExecute(state)) {
        return null;
      }

      const decomposedTail = this.decompose(tail, head.applyEffects(state));

      return decomposedTail && [head].concat(decomposedTail);
    }

    for (const method of head.methods) {
      if (!method.preconditions(state)) {
        continue;
      }

      const subtasks = typeof method.tasks === 'function' ? method.tasks(state) : method.tasks;
      const decomposedSubtasks = this.decompose(subtasks.concat(tail), state);

      if (decomposedSubtasks) {
        return decomposedSubtasks;
      }
    }

    return null;
  }
}
