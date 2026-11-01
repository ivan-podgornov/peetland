import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { PrimitiveTask } from '../../src';
import type { TestContext, TestState } from '../helpers';

/**
 * Создаёт примитивную задачу, методы которой — моки. Методы, которые не переданы, отвечают, что
 * задачу можно выполнить, она ничего не меняет и выполняется
 */
export function createMockedPrimitive(
  task: Partial<PrimitiveTask<TestState, TestContext>> = {}
): Mocked<PrimitiveTask<TestState, TestContext>> {
  return {
    name: 'mocked',
    canExecute: vi.fn(() => true),
    applyEffects: vi.fn((state: TestState) => state),
    start: vi.fn(() => 'running' as const),
    update: vi.fn(() => 'running' as const),
    stop: vi.fn(),
    ...task,
  } as Mocked<PrimitiveTask<TestState, TestContext>>;
}

/** Создаёт новый контекст, чтобы выполнения в разных тестах не пересекались */
export function createContext(): TestContext {
  return { name: 'context' };
}
