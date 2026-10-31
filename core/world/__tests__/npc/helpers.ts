import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN } from '@peetland/htn';
import { createActor } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';

import type { NpcData, NpcState } from '../../src';

/** Создаёт данные NPC. Поля, которые не переданы, заполняются незначимыми значениями */
export function createNpcData(data: Partial<NpcData> = {}): NpcData {
  return {
    id: 'peet',
    modelId: 230,
    spawnPosition: { x: 0, y: 0, z: 0 },
    spawnAngle: 0,
    traits: { conscientiousness: 50 },
    feelings: { shame: 0 },
    inventory: {},
    ...data,
  };
}

/** Создаёт HTN-агента, который ничего не делает */
export function createHtn(): IHTN<NpcState> {
  return { update: vi.fn(), stop: vi.fn() };
}

/** Создаёт фабрику, которая всегда возвращает переданного актора */
export function createActorFactory(actor: IActor = createActor()): IActorFactory {
  return { create: vi.fn(() => actor) };
}
