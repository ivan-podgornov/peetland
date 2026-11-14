import type { PlanNode, PlanStep } from '../src';

/** Составная задача в структуре плана: имя, выбранный метод, транзакция ли она и её дети */
export type PlannedCompound = Readonly<{
  name: string;
  method: string;
  transaction: boolean;
  children: PlanStructure;
}>;

/** Узел структуры плана: примитивная задача — её имя, составная — PlannedCompound */
export type PlanStructureNode = string | PlannedCompound;

/** Структура плана: задачи верхнего уровня по порядку */
export type PlanStructure = readonly PlanStructureNode[];

/** Собирает структуру плана, которая строится в planTree */
type MutableCompound = {
  name: string;
  method: string;
  transaction: boolean;
  children: PlanStructureNode[];
};

/** Возвращает цепочку узлов разложения шага от корня к самому шагу */
function getPath<TState, TContext>(step: PlanStep<TState, TContext>): PlanNode<TState, TContext>[] {
  const path: PlanNode<TState, TContext>[] = [];

  for (let node = step.isPartOf; node; node = node.isPartOf) {
    path.unshift(node);
  }

  return path;
}

/**
 * Возвращает структуру плана: дерево, в котором составные задачи — с выбранным методом, признаком
 * транзакции и детьми, а примитивные — их имена. Дерево собирается из цепочек isPartOf шагов, а
 * сравнивать его удобно со структурой из PlanStructureBuilder
 * @param steps - шаги плана, например из planSteps
 */
export function planTree<TState, TContext>(steps: PlanStep<TState, TContext>[]): PlanStructure {
  const roots: PlanStructureNode[] = [];
  /** Открытые узлы разложения от корня вглубь и их составные задачи в структуре */
  const open: { node: PlanNode<TState, TContext>; compound: MutableCompound }[] = [];

  steps.forEach((step) => {
    const path = getPath(step);
    let common = 0;

    while (common < open.length && open[common]?.node === path[common]) {
      common++;
    }

    open.length = common;

    path.slice(common).forEach((node) => {
      const compound: MutableCompound = {
        name: node.task.name,
        method: node.method.name,
        transaction: node.task.transaction === true,
        children: [],
      };

      (open.at(-1)?.compound.children ?? roots).push(compound);
      open.push({
        node,
        compound,
      });
    });

    (open.at(-1)?.compound.children ?? roots).push(step.task.name);
  });

  return roots;
}

/**
 * Возвращает узел транзакции шага: самый внешний узел в цепочке isPartOf, задача которого —
 * транзакция, или null
 */
function findTransaction<TState, TContext>(
  step: PlanStep<TState, TContext>
): PlanNode<TState, TContext> | null {
  return getPath(step).find((node) => node.task.transaction === true) ?? null;
}

/**
 * Возвращает имена задач каждой транзакции плана по порядку. Транзакция внутри транзакции — часть
 * внешней, а одна транзакция, запланированная дважды, — две транзакции
 * @param steps - шаги плана, например из planSteps
 */
export function planTransactions<TState, TContext>(
  steps: PlanStep<TState, TContext>[]
): string[][] {
  const transactions: string[][] = [];
  let current: PlanNode<TState, TContext> | null = null;

  steps.forEach((step) => {
    const transaction = findTransaction(step);

    if (!transaction) {
      current = null;
      return;
    }

    if (transaction !== current) {
      transactions.push([]);
      current = transaction;
    }

    transactions.at(-1)?.push(step.task.name);
  });

  return transactions;
}

/** Собирает детей составной задачи из переданного билдера */
type BuildChildren = (structure: PlanStructureBuilder) => PlanStructureBuilder;

/**
 * Собирает ожидаемую структуру плана по шагам, чтобы сравнить её со структурой из planTree.
 * Детей составной задачи собирает функция: она получает новый билдер и возвращает его
 *
 * @example
 * const expected = new PlanStructureBuilder()
 *   .compound('sell-bottles', 'sell-in-nearest-collection', (structure) =>
 *     structure
 *       .primitive('go-to-coords')
 *       .transaction('hand-over-bottles', 'hand-over-bottles', (transaction) =>
 *         transaction.primitive('remove-item').primitive('add-item')
 *       )
 *   )
 *   .build();
 *
 * expect(planTree(steps)).toStrictEqual(expected);
 */
export class PlanStructureBuilder {
  private readonly nodes: PlanStructureNode[] = [];

  /** Добавляет примитивную задачу */
  primitive(name: string): this {
    this.nodes.push(name);
    return this;
  }

  /** Добавляет составную задачу, которая не транзакция, с выбранным методом и детьми */
  compound(name: string, method: string, build: BuildChildren): this {
    return this.add(name, method, false, build);
  }

  /** Добавляет составную задачу-транзакцию с выбранным методом и детьми */
  transaction(name: string, method: string, build: BuildChildren): this {
    return this.add(name, method, true, build);
  }

  /** Возвращает собранную структуру в том же виде, что и planTree */
  build(): PlanStructure {
    return [...this.nodes];
  }

  private add(name: string, method: string, transaction: boolean, build: BuildChildren): this {
    this.nodes.push({
      name,
      method,
      transaction,
      children: [...build(new PlanStructureBuilder()).build()],
    });
    return this;
  }
}
