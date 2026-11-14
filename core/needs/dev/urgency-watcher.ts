import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { IUrgencyWatcher, IUrgencyWatcherFactory } from '../src';

/** Создаёт наблюдателя срочности, который на каждой проверке возвращает переданный результат */
export function createMockedUrgencyWatcher(ignited = false): Mocked<IUrgencyWatcher> {
  return { check: vi.fn(() => ignited) };
}

/** Создаёт фабрику, которая всегда возвращает переданного наблюдателя срочности */
export function createMockedUrgencyWatcherFactory(
  watcher: IUrgencyWatcher = createMockedUrgencyWatcher()
): Mocked<IUrgencyWatcherFactory> {
  return { create: vi.fn(() => watcher) };
}
