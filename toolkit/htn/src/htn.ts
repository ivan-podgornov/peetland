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
 * когда его мягко остановили
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
   * Мягко останавливает текущий план: просит исполнителя остановить его на ближайшей безопасной
   * границе (см. IExecutor.softStop) и ничего не ждёт. Когда исполнитель остановился, агент в том
   * же update составляет новый план. Если плана нет, останавливать нечего, и ничего не происходит
   */
  softStop(): void;
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
      const steps = this.planner.plan(this.root, state);

      if (!steps) {
        return;
      }

      this.executor = executorFactory(steps);
    }

    const status = this.executor.update(state, context);

    if (status !== 'running') {
      this.executor = null;
    }

    // Исполнитель мягко остановился и в этом update ничего не делал: новый план составляется сразу
    if (status === 'stopped') {
      this.update(state, context);
    }
  }

  stop(context: TContext) {
    if (!this.executor) {
      return;
    }

    this.executor.stop(context);
    this.executor = null;
  }

  softStop() {
    this.executor?.softStop();
  }
}
