import { createControlledObservable } from '@peetland/events/dev';
import { Geometry } from '@peetland/geometry';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';

import type { NpcData, NpcDeps, NpcFactoryDeps } from '../../src';
import { createTaskFactory } from '../tasks/helpers';

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

/** Создаёт зависимости фабрики NPC. Зависимости, которые не переданы, заполняются незначимыми моками */
export function createNpcFactoryDeps(deps: Partial<NpcFactoryDeps> = {}): NpcFactoryDeps {
  return {
    actorFactory: createMockedActorFactory(),
    htnFactory: createMockedHTNFactory(),
    frames: createControlledObservable().observable,
    geometry: new Geometry(),
    taskFactory: createTaskFactory(),
    ...deps,
  };
}
