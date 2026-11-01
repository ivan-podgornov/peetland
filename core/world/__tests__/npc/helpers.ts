import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { createMockedPsycheFactory, createPsycheState } from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';

import { vi } from 'vitest';

import type { NpcData, NpcDeps, NpcFactoryDeps } from '../../src';
import { createMockedPlaces } from '../places/helpers';

/** Создаёт данные NPC. Поля, которые не переданы, заполняются незначимыми значениями */
export function createNpcData(data: Partial<NpcData> = {}): NpcData {
  return {
    id: 'peet',
    modelId: 230,
    spawnPosition: { x: 0, y: 0, z: 0 },
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
    rootTaskFactory: { create: vi.fn(() => ({ name: 'root', methods: [] })) },
    places: createMockedPlaces(),
    frames: createControlledObservable().observable,
    ...deps,
  };
}

/** Создаёт зависимости фабрики NPC. Зависимости, которые не переданы, заполняются незначимыми моками */
export function createNpcFactoryDeps(deps: Partial<NpcFactoryDeps> = {}): NpcFactoryDeps {
  return {
    actorFactory: createMockedActorFactory(),
    htnFactory: createMockedHTNFactory(),
    inventoryFactory: createMockedInventoryFactory(),
    psycheFactory: createMockedPsycheFactory(),
    frames: createControlledObservable().observable,
    rootTaskFactory: { create: vi.fn(() => ({ name: 'root', methods: [] })) },
    ...deps,
  };
}
