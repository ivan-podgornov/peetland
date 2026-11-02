import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';

import type { NpcFactoryDeps } from '../src';

/** Создаёт зависимости фабрики NPC. Зависимости, которые не переданы, заполняются незначимыми моками */
export function createNpcFactoryDeps(deps: Partial<NpcFactoryDeps> = {}): NpcFactoryDeps {
  return {
    actorFactory: createMockedActorFactory(),
    htnFactory: createMockedHTNFactory(),
    inventoryFactory: createMockedInventoryFactory(),
    psycheFactory: createMockedPsycheFactory(),
    frames: createControlledObservable().observable,
    rootTaskFactory: {
      create: vi.fn(() => ({
        name: 'root',
        methods: [],
      })),
    },
    ...deps,
  };
}
