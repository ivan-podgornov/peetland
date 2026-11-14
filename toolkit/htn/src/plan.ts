import type { CompoundTask, Method, PrimitiveTask } from './task';

/**
 * Узел разложения: составная задача, метод, которым планировщик её разложил, и узел, частью
 * которого она запланирована. У узла корневой задачи родителя нет, поэтому цепочка isPartOf
 * приводит к корню. Узлы создаёт планировщик на каждое разложение, поэтому одна составная задача,
 * запланированная дважды, даёт два разных узла
 */
export type PlanNode<TState, TContext> = Readonly<{
  task: CompoundTask<TState, TContext>;
  method: Method<TState, TContext>;
  isPartOf: PlanNode<TState, TContext> | null;
}>;

/** Шаг плана: примитивная задача и узел разложения, частью которого она запланирована */
export type PlanStep<TState, TContext> = Readonly<{
  task: PrimitiveTask<TState, TContext>;
  /** Узел разложения или null, если корневая задача — сама примитивная */
  isPartOf: PlanNode<TState, TContext> | null;
}>;

/**
 * Возвращает узел транзакции, в которую входит шаг: самый внешний узел в цепочке isPartOf, задача
 * которого — транзакция (см. CompoundTask.transaction), или null, если шаг вне транзакции. Шаги
 * одной транзакции возвращают один и тот же узел
 */
export function findTransaction<TState, TContext>(
  step: PlanStep<TState, TContext>
): PlanNode<TState, TContext> | null {
  let transaction: PlanNode<TState, TContext> | null = null;

  for (let node = step.isPartOf; node; node = node.isPartOf) {
    if (node.task.transaction) {
      transaction = node;
    }
  }

  return transaction;
}
