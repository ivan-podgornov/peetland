import { Executor, type IExecutor } from './executor';
import { Planner, type IPlanner } from './planner';
import type { PrimitiveTask, Task } from './task';

export type HTNDeps<TState, TContext> = {
  executorFactory: (
    tasks: readonly PrimitiveTask<TState, TContext>[]
  ) => IExecutor<TState, TContext>;
  plannerFactory: () => IPlanner<TState>;
};

export function getDefaultDeps<TState, TContext>(): HTNDeps<TState, TContext> {
  return {
    executorFactory: (tasks: readonly PrimitiveTask<TState, TContext>[]) =>
      new Executor<TState, TContext>(tasks),
    plannerFactory: () => new Planner<TState>(),
  };
}

/** HTN-агент: планирует корневую задачу, исполняет план и перепланирует, когда план закончился */
export interface IHTN<TState, TContext> {
  /**
   * Продвигает исполнение плана с актуальным состоянием. Если плана нет, потому что он ещё не
   * составлен, завершился или упал, сначала составляет новый. Контекст передаётся задачам плана
   */
  update(state: TState, context: TContext): void;

  /** Останавливает исполнение текущего плана. Контекст передаётся задаче, которую останавливают */
  stop(context: TContext): void;
}

export class HTN<TState, TContext> implements IHTN<TState, TContext> {
  private readonly deps: HTNDeps<TState, TContext>;
  private readonly planner: IPlanner<TState>;
  private readonly root: Task<TState, TContext>;

  private executor: IExecutor<TState, TContext> | null;

  constructor(
    root: Task<TState, TContext>,
    deps: HTNDeps<TState, TContext> = getDefaultDeps<TState, TContext>()
  ) {
    this.deps = deps;
    this.planner = deps.plannerFactory();
    this.root = root;
    this.executor = null;
  }

  update(state: TState, context: TContext) {
    if (!this.executor) {
      const { executorFactory } = this.deps;
      const tasks = this.planner.plan(this.root, state);

      if (!tasks) {
        return;
      }

      this.executor = executorFactory(tasks);
    }

    const status = this.executor.update(state, context);

    if (status !== 'running') {
      this.executor = null;
    }
  }

  stop(context: TContext) {
    if (!this.executor) {
      return;
    }

    this.executor.stop(context);
    this.executor = null;
  }
}
