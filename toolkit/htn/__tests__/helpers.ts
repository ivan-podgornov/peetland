import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { IExecutor } from '../src/executor';
import type { IPlanner } from '../src/planner';
import type { CompoundTask, PrimitiveTask, Method, Task, TaskResult } from '../src/task';

export type TestState = { canExecute: boolean; counter: number };

export const testState = { canExecute: true, counter: 0 };

export type TestContext = { name: string };

export const testContext: TestContext = { name: 'context' };

export function primitive(name: string): PrimitiveTask<TestState, TestContext> {
  return {
    name,
    applyEffects: (state) => ({ ...state, canExecute: true }),
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

export function getDummyPlanner(
  plan: PrimitiveTask<TestState, TestContext>[] | null,
  secondPlan?: PrimitiveTask<TestState, TestContext>[] | null
): IPlanner<TestState> {
  return {
    plan: vi
      .fn()
      .mockReturnValueOnce(plan)
      .mockReturnValue(typeof secondPlan === 'undefined' ? plan : secondPlan),
  };
}

export function getDummyExecutor(taskResult: TaskResult): IExecutor<TestState, TestContext> {
  return {
    currentTask: null,
    update: vi.fn().mockReturnValue(taskResult),
    stop: vi.fn().mockReturnValue(taskResult),
  };
}
