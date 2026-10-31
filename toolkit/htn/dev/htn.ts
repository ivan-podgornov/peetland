import { vi } from 'vitest';

import type { IHTN, IHTNFactory } from '../src';

/** Создаёт HTN-агента, методы которого — моки, которые ничего не делают */
export function createMockedHTN<TState, TContext>(): IHTN<TState, TContext> {
  return { update: vi.fn(), stop: vi.fn() };
}

/** Создаёт фабрику, которая всегда возвращает переданного HTN-агента */
export function createMockedHTNFactory<TState, TContext>(
  htn: IHTN<TState, TContext> = createMockedHTN<TState, TContext>()
): IHTNFactory<TState, TContext> {
  return { create: vi.fn(() => htn) };
}
