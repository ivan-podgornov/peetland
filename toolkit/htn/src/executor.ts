import type { PlanNode, PlanStep } from './plan';
import type { PrimitiveTask, TaskResult } from './task';

/** Статус выполнения задачи */
export type ExecuteStatus = TaskResult | 'idle' | 'stopped';

export interface IExecutor<TState, TContext> {
  /** Обновляет выполнение текущей задачи или, если ранее задачи выполняться не начали, начинает выполнять */
  update(state: TState, context: TContext): ExecuteStatus;

  /** Останавливает выполнение */
  stop(context: TContext): void;

  /**
   * Просит остановить выполнение на ближайшей безопасной границе плана и ничего не ждёт. На
   * следующем update, если текущая задача вне транзакции или транзакция ещё не началась (см.
   * CompoundTask.transaction), исполнитель останавливает выполнение и возвращает 'stopped'. Если
   * транзакция идёт, исполняет план дальше и останавливается, когда она кончится
   */
  softStop(): void;

  /** Возвращает задачу, которая выполняется в данный момент */
  get currentTask(): PrimitiveTask<TState, TContext> | null;
}

export class Executor<TState, TContext> implements IExecutor<TState, TContext> {
  private currentTaskIndex: number;
  private readonly steps: readonly PlanStep<TState, TContext>[];
  private status: ExecuteStatus;
  private taskStarted: boolean;
  private softStopRequested: boolean;

  /**
   * Создаёт исполнителя для указанного плана. Предполагается, что на вход будет приходить план,
   * который составил планировщик. Так же, предполагается, что план не может быть пустым, так как
   * пустой план - это повод перепланировать, а не выполнять.
   * @param steps - шаги плана (см. PlanStep)
   */
  constructor(steps: readonly PlanStep<TState, TContext>[]) {
    if (!steps.length) {
      throw new Error("Tasks list can't be empty");
    }

    this.steps = steps;
    this.currentTaskIndex = 0;
    this.status = 'idle';
    this.taskStarted = false;
    this.softStopRequested = false;
  }

  get currentTask(): PrimitiveTask<TState, TContext> {
    return this.currentStep.task;
  }

  update(state: TState, context: TContext): ExecuteStatus {
    if (!this.canTouchTask()) {
      throw new Error(`Can't update, because execution is already ${this.status}`);
    }

    if (this.softStopRequested && this.canStop()) {
      this.stop(context);
      return this.status;
    }

    this.status = this.taskStarted
      ? this.currentTask.update(state, context)
      : this.start(state, context);

    if (this.status === 'failed') {
      return this.status;
    }

    if (this.status === 'success') {
      if (!this.nextTask) {
        // Если задачи к выполнению закончились, возвращаем результат выполнения задачи и всё на этом
        return this.status;
      }

      // Но если есть ещё задачи к выполнению, несмотря на то что предыдущая задача выполнена, задачи ещё продолжают выполняться
      this.status = 'running';
      // Это нужно чтоб при следующем вызове update, исполнитель начал выполнять новую задачу, а не вызвал у неё метод update
      this.taskStarted = false;
      // Меняем индекс текущей задачи на следующий, чтобы при следующем вызове update, начала выполняться следующая задача
      this.currentTaskIndex = this.currentTaskIndex + 1;
    }

    return this.status;
  }

  stop(context: TContext) {
    if (!this.canTouchTask()) {
      throw new Error(`Can't stop, because execution is already ${this.status}`);
    }

    this.status = 'stopped';

    if (this.taskStarted) {
      this.currentTask.stop(context);
    }
  }

  softStop() {
    this.softStopRequested = true;
  }

  private get currentStep(): PlanStep<TState, TContext> {
    const step = this.steps[this.currentTaskIndex];

    if (!step) {
      const message = `Current task' index (${this.currentTaskIndex}) must be in range of tasks length (${this.steps.length})`;
      throw new RangeError(message);
    }

    return step;
  }

  /**
   * Проверяет, можно ли остановить выполнение, не сломав транзакцию. Можно, если текущая задача
   * вне транзакции или если с неё транзакция только начинается и задача ещё не началась. Нельзя,
   * если задача транзакции идёт или если она ещё не началась, но продолжает транзакцию предыдущей
   */
  private canStop(): boolean {
    const current = this.currentStep;

    if (!this.isPartOfTransaction(current)) {
      return true;
    }

    if (this.taskStarted) {
      return false;
    }

    // Задача ещё не началась: остановить можно, если с неё транзакция только начинается
    const previous = this.steps[this.currentTaskIndex - 1];

    return !previous || !this.isPartOfSameTransaction(previous, current);
  }

  /** Проверяет, запланирован ли шаг частью транзакции */
  private isPartOfTransaction(step: PlanStep<TState, TContext>): boolean {
    return this.findTransaction(step.isPartOf) !== null;
  }

  /**
   * Проверяет, запланированы ли шаги частью одной транзакции. Одна транзакция, запланированная
   * дважды, — две разные транзакции, поэтому сравниваются узлы транзакций, а не задачи
   */
  private isPartOfSameTransaction(
    first: PlanStep<TState, TContext>,
    second: PlanStep<TState, TContext>
  ): boolean {
    const transaction = this.findTransaction(first.isPartOf);

    return transaction !== null && transaction === this.findTransaction(second.isPartOf);
  }

  /**
   * Возвращает узел транзакции, частью которой запланирован узел: самый внешний узел-транзакцию
   * среди самого узла и его родителей по цепочке isPartOf, или null. Поэтому транзакция внутри
   * транзакции — часть внешней
   */
  private findTransaction(
    node: PlanNode<TState, TContext> | null
  ): PlanNode<TState, TContext> | null {
    if (!node) {
      return null;
    }

    // Транзакция выше по цепочке важнее: внутренняя транзакция — её часть
    const outer = this.findTransaction(node.isPartOf);

    if (outer) {
      return outer;
    }

    return node.task.transaction ? node : null;
  }

  /** Начинает выполнение задачи */
  private start(state: TState, context: TContext): TaskResult {
    if (!this.currentTask.canExecute(state)) {
      return 'failed';
    }

    const result = this.currentTask.start(state, context);
    this.taskStarted = true;

    return result;
  }

  /**
   * Проверяет, можно ли "трогать" текущую задачу. Если она уже выполнена,
   * остановлена или завершилась с ошибкой, трогать нельзя
   */
  private canTouchTask(): boolean {
    return !['failed', 'success', 'stopped'].includes(this.status);
  }

  /** Возвращает следующую к выполнению задачу */
  private get nextTask(): PrimitiveTask<TState, TContext> | null {
    const index = this.currentTaskIndex + 1;

    return this.steps[index]?.task ?? null;
  }
}
