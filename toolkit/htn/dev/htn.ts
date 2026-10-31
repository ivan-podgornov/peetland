import { vi } from 'vitest';

import type { IHTN, IHTNFactory } from '../src';

/** Создаёт HTN-агента, методы которого — моки, которые ничего не делают */
export function createMockedHTN<TState>(): IHTN<TState> {
  return { update: vi.fn(), stop: vi.fn() };
}

/** Создаёт фабрику, которая всегда возвращает переданного HTN-агента */
export function createMockedHTNFactory<TState>(
  htn: IHTN<TState> = createMockedHTN<TState>()
): IHTNFactory<TState> {
  return { create: vi.fn(() => htn) };
}
