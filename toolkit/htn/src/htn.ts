import { Executor, type IExecutor } from './executor';
import type { PlanStep } from './plan';
import { Planner, type IPlanner } from './planner';
import type { Task } from './task';

export type HTNDeps<TState, TContext> = {
  executorFactory: (steps: readonly PlanStep<TState, TContext>[]) => IExecutor<TState, TContext>;
  plannerFactory: () => IPlanner<TState>;
};

export function getDefaultDeps<TState, TContext>(): HTNDeps<TState, TContext> {
  return {
    executorFactory: (steps: readonly PlanStep<TState, TContext>[]) =>
      new Executor<TState, TContext>(steps),
    plannerFactory: () => new Planner<TState>(),
  };
}

/**
 * HTN-агент: планирует корневую задачу, исполняет план и перепланирует, когда план закончился или
 * когда его попросили
 */
export interface IHTN<TState, TContext> {
  /**
   * Продвигает исполнение плана с актуальным состоянием. Если плана нет, потому что он ещё не
   * составлен, завершился или упал, сначала составляет новый. Контекст передаётся задачам плана
   */
  update(state: TState, context: TContext): void;

  /** Останавливает исполнение текущего плана. Контекст передаётся задаче, которую останавливают */
  stop(context: TContext): void;

  /**
   * Просит перепланировать на ближайшей безопасной границе плана и ничего не ждёт. На следующем
   * update, если текущая задача вне транзакции, агент останавливает план и в том же update
   * составляет новый. Если внутри транзакции, исполняет план дальше, пока транзакция не кончится
   * (см. CompoundTask.transaction). Повторные просьбы до перепланирования ничего не меняют
   */
  requestReplan(): void;
}

export class HTN<TState, TContext> implements IHTN<TState, TContext> {
  private readonly deps: HTNDeps<TState, TContext>;
  private readonly planner: IPlanner<TState>;
  private readonly root: Task<TState, TContext>;

  private executor: IExecutor<TState, TContext> | null;
  private replanRequested: boolean;

  constructor(
    root: Task<TState, TContext>,
    deps: HTNDeps<TState, TContext> = getDefaultDeps<TState, TContext>()
  ) {
    this.deps = deps;
    this.planner = deps.plannerFactory();
    this.root = root;
    this.executor = null;
    this.replanRequested = false;
  }

  update(state: TState, context: TContext) {
    if (this.replanRequested && this.executor?.interruptible) {
      this.executor.stop(context);
      this.executor = null;
    }

    if (!this.executor) {
      const { executorFactory } = this.deps;
      const steps = this.planner.plan(this.root, state);

      this.replanRequested = false;

      if (!steps) {
        return;
      }

      this.executor = executorFactory(steps);
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

  requestReplan() {
    this.replanRequested = true;
  }
}
