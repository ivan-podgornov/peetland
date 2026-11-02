import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { createMockedPsycheFactory, createPsycheState } from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Npc, NpcKind } from '../src';
import type { INpcFactory, NpcData, NpcDeps } from '../src';

/** Создаёт данные NPC. Поля, которые не переданы, заполняются незначимыми значениями */
export function createNpcData(data: Partial<NpcData> = {}): NpcData {
  return {
    id: 'peet',
    kind: NpcKind.Homeless,
    modelId: 230,
    spawnPosition: {
      x: 0,
      y: 0,
      z: 0,
    },
    spawnAngle: 0,
    psyche: createPsycheState(),
    inventory: {},
    ...data,
  };
}

/** Создаёт зависимости NPC. Зависимости, которые не переданы, заполняются незначимыми моками */
export function createNpcDeps(deps: Partial<NpcDeps> = {}): NpcDeps {
  return {
    actorFactory: createMockedActorFactory(),
    htnFactory: createMockedHTNFactory(),
    inventoryFactory: createMockedInventoryFactory(),
    psycheFactory: createMockedPsycheFactory(),
    rootTaskFactories: {
      [NpcKind.Homeless]: {
        create: vi.fn(() => ({
          name: 'root',
          methods: [],
        })),
      },
    },
    frames: createControlledObservable().observable,
    ...deps,
  };
}

/** Создаёт фабрику NPC, которая создаёт NPC по данным с незначимыми зависимостями */
export function createMockedNpcFactory(): Mocked<INpcFactory> {
  return { create: vi.fn((data: NpcData) => new Npc(data, createNpcDeps())) };
}
