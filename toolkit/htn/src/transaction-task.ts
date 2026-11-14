import type { CompoundTask, Method, Task } from './task';

/**
 * Транзакция из задач, которые нельзя разорвать: составная задача с одним методом, который всегда
 * подходит и выполняет задачи по очереди (см. CompoundTask.transaction)
 */
export class TransactionTask<TState, TContext> implements CompoundTask<TState, TContext> {
  readonly transaction = true;

  readonly name: string;

  readonly methods: Method<TState, TContext>[];

  /**
   * @param name - название транзакции
   * @param tasks - задачи транзакции
   */
  constructor(name: string, tasks: Task<TState, TContext>[]) {
    this.name = name;
    this.methods = [
      {
        name,
        preconditions: () => true,
        tasks,
      },
    ];
  }
}
