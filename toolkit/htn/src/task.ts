/** Результат выполнения задачи */
export type TaskResult = 'success' | 'running' | 'failed';

/**
 * Примитивная задача.
 *
 * `TState` — состояние мира: только данные, по которым задача проверяет, можно ли её выполнить, и
 * считает эффекты. `TContext` — контекст исполнения: мутабельные сущности, которым задача отдаёт
 * команды, например актор. Контекст получают только методы, которые что-то меняют: `start`,
 * `update` и `stop`
 */
export interface PrimitiveTask<TState, TContext> {
  /** Название задачи. Используется для отладки и логгирования */
  name: string;

  /** Проверяет можно ли выполнить задачу при указанном состоянии мира */
  canExecute(state: TState): boolean;

  /**
   * Применяет эффекты к состоянию мира. Функция иммутабельная, поэтому она не мутирует состояние,
   * а возвращает новое с применёнными эффектами
   */
  applyEffects(state: TState): TState;

  /** Начинает выполнение задачи */
  start(state: TState, context: TContext): TaskResult;

  /** Вызывается каждый тик с обновлённым состоянием мира */
  update(state: TState, context: TContext): TaskResult;

  /** Прекращает выполение задачи. Вызывается, когда нужно завершить задачу извне */
  stop(context: TContext): void;
}

export interface CompoundTask<TState, TContext> {
  /** Название задачи. Используется для отладки и логгирования */
  name: string;

  /** Методы выполнения составной задачи */
  methods: Method<TState, TContext>[];
}

export type Task<TState, TContext> =
  PrimitiveTask<TState, TContext> | CompoundTask<TState, TContext>;

export interface Method<TState, TContext> {
  /** Название метода выполнения составной задачи */
  name: string;

  /** Задачи, которые нужно выполнить, чтобы реализовать метод */
  tasks: Task<TState, TContext>[];

  /**
   * Проверяет, подходит ли метод для планирования, при текущем состоянии мира
   * @param state - текущее состояние мира
   */
  preconditions(state: TState): boolean;
}

/** Проверяет, является ли задача примитивной */
export function isPrimitive<TState, TContext>(
  task: Task<TState, TContext>
): task is PrimitiveTask<TState, TContext> {
  return 'canExecute' in task;
}
