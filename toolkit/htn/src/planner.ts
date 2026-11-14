import type { PlanNode, PlanStep } from './plan';
import { isPrimitive } from './task';
import type { Task } from './task';

/** Планировщик работает только с состоянием и о контексте исполнения задач не знает */
export interface IPlanner<TState> {
  /** Возвращает план корневой задачи из шагов (см. PlanStep) или null, если план составить нельзя */
  plan<TContext>(root: Task<TState, TContext>, state: TState): PlanStep<TState, TContext>[] | null;
}

/** Задача, которую ещё предстоит разложить, и узел разложения, частью которого она запланирована */
type DecomposingTask<TState, TContext> = Readonly<{
  task: Task<TState, TContext>;
  isPartOf: PlanNode<TState, TContext> | null;
}>;

export class Planner<TState> implements IPlanner<TState> {
  plan<TContext>(root: Task<TState, TContext>, state: TState): PlanStep<TState, TContext>[] | null {
    return this.decompose([this.partOf(root, null)], state);
  }

  private decompose<TContext>(
    tasks: DecomposingTask<TState, TContext>[],
    state: TState
  ): PlanStep<TState, TContext>[] | null {
    const [head, ...tail] = tasks;

    if (!head) {
      return [];
    }

    const { task, isPartOf } = head;

    if (isPrimitive(task)) {
      if (!task.canExecute(state)) {
        return null;
      }

      const decomposedTail = this.decompose(tail, task.applyEffects(state));

      return decomposedTail && [this.partOf(task, isPartOf)].concat(decomposedTail);
    }

    for (const method of task.methods) {
      if (!method.preconditions(state)) {
        continue;
      }

      const node: PlanNode<TState, TContext> = {
        task,
        method,
        isPartOf,
      };
      const subtasks = typeof method.tasks === 'function' ? method.tasks(state) : method.tasks;
      const decomposedSubtasks = this.decompose(
        subtasks.map((subtask) => this.partOf(subtask, node)).concat(tail),
        state
      );

      if (decomposedSubtasks) {
        return decomposedSubtasks;
      }
    }

    return null;
  }

  /**
   * Возвращает задачу вместе с узлом разложения, частью которого она запланирована: для примитивной
   * задачи — шаг плана, для любой — задачу, которую ещё предстоит разложить
   */
  private partOf<TTask, TContext>(
    task: TTask,
    isPartOf: PlanNode<TState, TContext> | null
  ): Readonly<{
    task: TTask;
    isPartOf: PlanNode<TState, TContext> | null;
  }> {
    return {
      task,
      isPartOf,
    };
  }
}
