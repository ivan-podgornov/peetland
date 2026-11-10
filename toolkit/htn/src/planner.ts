import type { PlanStep } from './plan';
import { isPrimitive } from './task';
import type { Task } from './task';

/** Планировщик работает только с состоянием и о контексте исполнения задач не знает */
export interface IPlanner<TState> {
  /**
   * Возвращает план корневой задачи: шаги с примитивными задачами и транзакциями, в которые они
   * входят, или null, если план составить нельзя
   */
  plan<TContext>(root: Task<TState, TContext>, state: TState): PlanStep<TState, TContext>[] | null;
}

/** Задача, которую ещё предстоит разложить, и транзакция, в которую она входит */
type PendingTask<TState, TContext> = Readonly<{
  task: Task<TState, TContext>;
  transaction: number | null;
}>;

export class Planner<TState> implements IPlanner<TState> {
  /** Номер следующей транзакции. Сбрасывается на каждый план */
  private nextTransaction = 0;

  plan<TContext>(root: Task<TState, TContext>, state: TState): PlanStep<TState, TContext>[] | null {
    this.nextTransaction = 0;

    return this.decompose(
      [
        {
          task: root,
          transaction: null,
        },
      ],
      state
    );
  }

  private decompose<TContext>(
    pending: PendingTask<TState, TContext>[],
    state: TState
  ): PlanStep<TState, TContext>[] | null {
    const [head, ...tail] = pending;

    if (!head?.task) {
      return [];
    }

    const { task, transaction } = head;

    if (isPrimitive(task)) {
      if (!task.canExecute(state)) {
        return null;
      }

      const decomposedTail = this.decompose(tail, task.applyEffects(state));

      return (
        decomposedTail &&
        [
          {
            task,
            transaction,
          },
        ].concat(decomposedTail)
      );
    }

    // Транзакция внутри транзакции — часть внешней
    const subtasksTransaction = transaction ?? (task.transaction ? this.nextTransaction++ : null);

    for (const method of task.methods) {
      if (!method.preconditions(state)) {
        continue;
      }

      const subtasks = typeof method.tasks === 'function' ? method.tasks(state) : method.tasks;
      const decomposedSubtasks = this.decompose(
        subtasks
          .map((subtask) => ({
            task: subtask,
            transaction: subtasksTransaction,
          }))
          .concat(tail),
        state
      );

      if (decomposedSubtasks) {
        return decomposedSubtasks;
      }
    }

    return null;
  }
}
