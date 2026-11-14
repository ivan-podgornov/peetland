import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { ExecuteStatus, IExecutor } from '../src/executor';
import type { PlanNode, PlanStep } from '../src/plan';
import type { IPlanner } from '../src/planner';
import type { CompoundTask, PrimitiveTask, Method, Task } from '../src/task';

export type TestState = { canExecute: boolean; counter: number };

export const testState = {
  canExecute: true,
  counter: 0,
};

export type TestContext = { name: string };

export const testContext: TestContext = { name: 'context' };

export function primitive(name: string): PrimitiveTask<TestState, TestContext> {
  return {
    name,
    applyEffects: (state) => ({
      ...state,
      canExecute: true,
    }),
    canExecute: (state) => state.canExecute,
    start: () => 'running',
    update: () => 'running',
    stop: () => {},
  };
}

export function blockedPrimitive(name: string): PrimitiveTask<TestState, TestContext> {
  return {
    ...primitive(name),
    canExecute: () => false,
  };
}

export function compound(
  name: string,
  ...methods: Method<TestState, TestContext>[]
): CompoundTask<TestState, TestContext> {
  return {
    name,
    methods,
  };
}

/** Составная задача-транзакция (см. CompoundTask.transaction) */
export function transaction(
  name: string,
  ...methods: Method<TestState, TestContext>[]
): CompoundTask<TestState, TestContext> {
  return {
    ...compound(name, ...methods),
    transaction: true,
  };
}

/** Возвращает узел разложения составной задачи первым методом */
export function node(
  task: CompoundTask<TestState, TestContext>,
  isPartOf: PlanNode<TestState, TestContext> | null = null
): PlanNode<TestState, TestContext> {
  const [first = method('method')] = task.methods;

  return {
    task,
    method: first,
    isPartOf,
  };
}

export function method(
  name: string,
  ...tasks: Task<TestState, TestContext>[]
): Method<TestState, TestContext> {
  return {
    name,
    tasks,
    preconditions: (state) => state.canExecute,
  };
}

/** Метод, подзадачи которого собирает функция от состояния */
export function dynamicMethod(
  name: string,
  tasks: (state: TestState) => Task<TestState, TestContext>[]
): Method<TestState, TestContext> {
  return {
    name,
    tasks,
    preconditions: (state) => state.canExecute,
  };
}

export function blockedMethod(
  name: string,
  ...tasks: Task<TestState, TestContext>[]
): Method<TestState, TestContext> {
  return {
    ...method(name, ...tasks),
    preconditions: () => false,
  };
}

/**
 * Примитив-шпион: можно выполнить всегда, а `canExecute` и `applyEffects` запоминают вызовы.
 * Если передан `stateAfter`, то эффект примитива - вернуть именно это состояние
 */
export function spyPrimitive(
  name: string,
  stateAfter?: TestState
): PrimitiveTask<TestState, TestContext> &
  Pick<Mocked<PrimitiveTask<TestState, TestContext>>, 'canExecute' | 'applyEffects'> {
  return {
    ...primitive(name),
    canExecute: vi.fn(() => true),
    applyEffects: vi.fn((state: TestState) => stateAfter ?? state),
  };
}

/** Метод-шпион: подходит всегда, а `preconditions` запоминает вызовы */
export function spyMethod(
  name: string,
  ...tasks: Task<TestState, TestContext>[]
): Method<TestState, TestContext> & Pick<Mocked<Method<TestState, TestContext>>, 'preconditions'> {
  return {
    ...method(name, ...tasks),
    preconditions: vi.fn(() => true),
  };
}

export function getNames(tasks: Task<TestState, TestContext>[]): string[] {
  return tasks.map((task) => task.name);
}

/** Возвращает шаги плана из задач, которые все запланированы частью одного узла */
export function toSteps(
  tasks: PrimitiveTask<TestState, TestContext>[],
  isPartOf: PlanNode<TestState, TestContext> | null = null
): PlanStep<TestState, TestContext>[] {
  return tasks.map((task) => ({
    task,
    isPartOf,
  }));
}

/** Возвращает названия задач плана */
export function getStepNames(steps: PlanStep<TestState, TestContext>[]): string[] {
  return steps.map((step) => step.task.name);
}

/** Создаёт планировщика, который возвращает план из переданных задач */
export function getDummyPlanner(
  plan: PrimitiveTask<TestState, TestContext>[] | null,
  secondPlan?: PrimitiveTask<TestState, TestContext>[] | null
): IPlanner<TestState> {
  const first = plan && toSteps(plan);
  const second = typeof secondPlan === 'undefined' ? first : secondPlan && toSteps(secondPlan);

  return { plan: vi.fn().mockReturnValueOnce(first).mockReturnValue(second) };
}

/** Создаёт исполнителя, который всегда возвращает переданный результат */
export function getDummyExecutor(
  taskResult: ExecuteStatus
): Mocked<IExecutor<TestState, TestContext>> {
  return {
    currentTask: null,
    softStop: vi.fn(),
    update: vi.fn().mockReturnValue(taskResult),
    stop: vi.fn().mockReturnValue(taskResult),
  };
}
