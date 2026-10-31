import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';

import type { NpcData, NpcDeps } from '../../src';

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

/** Создаёт зависимости NPC. Зависимости, которые не переданы, заполняются незначимыми моками */
export function createNpcDeps(deps: Partial<NpcDeps> = {}): NpcDeps {
  return {
    actorFactory: createMockedActorFactory(),
    htnFactory: createMockedHTNFactory(),
    rootTask: { name: 'root', methods: [] },
    frames: createControlledObservable().observable,
    ...deps,
  };
}
