import type { PrimitiveTask, TaskResult } from './task';

export type ParallelTaskOptions<TState, TContext> = {
  /** Основная задача: результат параллельной задачи — её результат */
  main: PrimitiveTask<TState, TContext>;
  /**
   * Фоновая задача: выполняется, пока выполняется основная, а когда завершилась успешно,
   * запускается заново. Её эффекты не учитываются, поэтому она не должна менять состояние
   */
  background: PrimitiveTask<TState, TContext>;
};

/** Выполнение параллельной задачи в конкретном контексте */
type Execution = {
  /** Выполняется ли фоновая задача. Если нет, в следующем update её нужно запустить заново */
  isBackgroundRunning: boolean;
};

/**
 * Примитивная задача, которая выполняет две задачи одновременно: основную и фоновую. Завершается
 * с результатом основной и тогда же останавливает фоновую. Если фоновая завершилась ошибкой,
 * останавливает основную и завершается с 'failed'. Например, ждать, пока повезёт, и всё это время
 * проигрывать анимацию. Задачи не должны мешать друг другу: например, нельзя одновременно идти в
 * две стороны. Одну задачу могут выполнять в разных контекстах, поэтому выполнения хранятся по
 * контекстам, а не в полях задачи
 */
export class ParallelTask<TState, TContext> implements PrimitiveTask<TState, TContext> {
  readonly name = 'parallel';

  private readonly options: ParallelTaskOptions<TState, TContext>;
  private readonly executions = new Map<TContext, Execution>();

  constructor(options: ParallelTaskOptions<TState, TContext>) {
    this.options = options;
  }

  /** Выполнить можно, если можно выполнить обе задачи */
  canExecute(state: TState): boolean {
    const { main, background } = this.options;

    return main.canExecute(state) && background.canExecute(state);
  }

  /** Применяет эффекты только основной задачи */
  applyEffects(state: TState): TState {
    return this.options.main.applyEffects(state);
  }

  /**
   * Начинает основную задачу, а если она не завершилась сразу, — и фоновую. Если основная
   * завершилась сразу, возвращает её результат
   */
  start(state: TState, context: TContext): TaskResult {
    const { main } = this.options;
    const result = main.start(state, context);

    if (result !== 'running') {
      return result;
    }

    const execution: Execution = { isBackgroundRunning: false };
    this.executions.set(context, execution);

    return this.updateBackground(state, context, execution);
  }

  /**
   * Обновляет основную задачу и, если она ещё выполняется, фоновую. Если задачу в этом контексте
   * не начинали, возвращает 'failed'
   */
  update(state: TState, context: TContext): TaskResult {
    const { main } = this.options;
    const execution = this.executions.get(context);

    if (!execution) {
      return 'failed';
    }

    const result = main.update(state, context);

    if (result !== 'running') {
      this.stopBackground(context, execution);
      return result;
    }

    return this.updateBackground(state, context, execution);
  }

  /** Останавливает обе задачи. Если задачу в этом контексте не начинали, ничего не делает */
  stop(context: TContext): void {
    const execution = this.executions.get(context);

    if (!execution) {
      return;
    }

    this.options.main.stop(context);
    this.stopBackground(context, execution);
  }

  /**
   * Продвигает фоновую задачу: запускает, если она не выполняется, иначе обновляет. Если фоновая
   * завершилась ошибкой, останавливает основную и возвращает 'failed', иначе — 'running'
   */
  private updateBackground(state: TState, context: TContext, execution: Execution): TaskResult {
    const { main, background } = this.options;
    let result: TaskResult;

    if (execution.isBackgroundRunning) {
      result = background.update(state, context);
    } else {
      result = background.canExecute(state) ? background.start(state, context) : 'failed';
    }

    execution.isBackgroundRunning = result === 'running';

    if (result === 'failed') {
      this.executions.delete(context);
      main.stop(context);
      return 'failed';
    }

    return 'running';
  }

  /** Останавливает фоновую задачу, если она выполняется, и забывает выполнение */
  private stopBackground(context: TContext, execution: Execution): void {
    this.executions.delete(context);

    if (execution.isBackgroundRunning) {
      this.options.background.stop(context);
    }
  }
}
