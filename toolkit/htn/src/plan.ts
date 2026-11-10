import type { PrimitiveTask } from './task';

/**
 * Шаг плана: примитивная задача и транзакция, в которую она входит. Шаги одной транзакции идут в
 * плане подряд и нельзя прервать посередине (см. CompoundTask.transaction)
 */
export type PlanStep<TState, TContext> = Readonly<{
  task: PrimitiveTask<TState, TContext>;
  /** Номер транзакции, уникальный в плане, или null, если задача вне транзакции */
  transaction: number | null;
}>;
