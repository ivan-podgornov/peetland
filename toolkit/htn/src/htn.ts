import { Executor, type IExecutor } from './executor';
import { Planner, type IPlanner } from './planner';
import type { PrimitiveTask, Task } from './task';

export type HTNDeps<TState> = {
  executorFactory: (tasks: readonly PrimitiveTask<TState>[]) => IExecutor<TState>;
  plannerFactory: () => IPlanner<TState>;
};

export function getDefaultDeps<TState>(): HTNDeps<TState> {
  return {
    executorFactory: (tasks: readonly PrimitiveTask<TState>[]) => new Executor<TState>(tasks),
    plannerFactory: () => new Planner<TState>(),
  };
}

/** HTN-агент: планирует корневую задачу, исполняет план и перепланирует, когда план закончился */
export interface IHTN<TState> {
  /**
   * Продвигает исполнение плана с актуальным состоянием. Если плана нет, потому что он ещё не
   * составлен, завершился или упал, сначала составляет новый
   */
  update(state: TState): void;

  /** Останавливает исполнение текущего плана */
  stop(): void;
}

export class HTN<TState> implements IHTN<TState> {
  private readonly deps: HTNDeps<TState>;
  private readonly planner: IPlanner<TState>;
  private readonly root: Task<TState>;

  private executor: IExecutor<TState> | null;

  constructor(root: Task<TState>, deps: HTNDeps<TState> = getDefaultDeps<TState>()) {
    this.deps = deps;
    this.planner = deps.plannerFactory();
    this.root = root;
    this.executor = null;
  }

  update(state: TState) {
    if (!this.executor) {
      const { executorFactory } = this.deps;
      const tasks = this.planner.plan(this.root, state);

      if (!tasks) {
        return;
      }

      this.executor = executorFactory(tasks);
    }

    const status = this.executor.update(state);

    if (status !== 'running') {
      this.executor = null;
    }
  }

  stop() {
    if (!this.executor) {
      return;
    }

    this.executor.stop();
    this.executor = null;
  }
}
