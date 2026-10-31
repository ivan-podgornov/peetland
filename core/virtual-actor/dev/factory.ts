import type { IActor, IActorFactory } from '@peetland/game';
import { vi } from 'vitest';

import { createActor } from './actor';

/** Создаёт фабрику, которая всегда возвращает переданного актора */
export function createMockedActorFactory(actor: IActor = createActor()): IActorFactory {
  return { create: vi.fn(() => actor) };
}
