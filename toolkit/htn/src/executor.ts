import type { PlanStep } from './plan';
import type { PrimitiveTask, TaskResult } from './task';

/** Статус выполнения задачи */
export type ExecuteStatus = TaskResult | 'idle' | 'stopped';

export interface IExecutor<TState, TContext> {
  /** Обновляет выполнение текущей задачи или, если ранее задачи выполняться не начали, начинает выполнять */
  update(state: TState, context: TContext): ExecuteStatus;

  /** Останавливает выполнение */
  stop(context: TContext): void;

  /** Возвращает задачу, которая выполняется в данный момент */
  get currentTask(): PrimitiveTask<TState, TContext> | null;

  /**
   * Возвращает, можно ли сейчас прервать выполнение, не сломав транзакцию: текущая задача вне
   * транзакции или транзакция ещё не началась
   */
  get interruptible(): boolean;
}

export class Executor<TState, TContext> implements IExecutor<TState, TContext> {
  private currentTaskIndex: number;
  private readonly steps: readonly PlanStep<TState, TContext>[];
  private status: ExecuteStatus;
  private taskStarted: boolean;

  /**
   * Создаёт исполнителя для указанного плана. Предполагается, что на вход будет приходить план,
   * который составил планировщик. Так же, предполагается, что план не может быть пустым, так как
   * пустой план - это повод перепланировать, а не выполнять.
   * @param steps - шаги плана: задачи и транзакции, в которые они входят
   */
  constructor(steps: readonly PlanStep<TState, TContext>[]) {
    if (!steps.length) {
      throw new Error("Tasks list can't be empty");
    }

    this.steps = steps;
    this.currentTaskIndex = 0;
    this.status = 'idle';
    this.taskStarted = false;
  }

  get currentTask(): PrimitiveTask<TState, TContext> {
    return this.currentStep.task;
  }

  get interruptible(): boolean {
    const { transaction } = this.currentStep;

    if (transaction === null) {
      return true;
    }

    if (this.taskStarted) {
      return false;
    }

    // Задача ещё не началась: прервать можно, если с неё транзакция только начинается
    return this.steps[this.currentTaskIndex - 1]?.transaction !== transaction;
  }

  update(state: TState, context: TContext): TaskResult {
    if (!this.canTouchTask()) {
      throw new Error(`Can't update, because execution is already ${this.status}`);
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

  private get currentStep(): PlanStep<TState, TContext> {
    const step = this.steps[this.currentTaskIndex];

    if (!step) {
      const message = `Current task' index (${this.currentTaskIndex}) must be in range of tasks length (${this.steps.length})`;
      throw new RangeError(message);
    }

    return step;
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
