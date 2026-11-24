import { Addictions } from '@peetland/addictions';
import {
  createAddictionsData,
  createAddictionsDeps,
  createAddictionsState,
} from '@peetland/addictions/dev';
import { AbortController } from '@peetland/events';
import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN } from '@peetland/htn/dev';
import { Inventory } from '@peetland/inventory';
import { Needs } from '@peetland/needs';
import {
  createMockedUrgencyWatcher,
  createNeedValues,
  createNeedsDeps,
  createNeedsState,
} from '@peetland/needs/dev';
import { Psyche } from '@peetland/psyche';
import { createPsycheDeps, createPsycheState } from '@peetland/psyche/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Npc, NpcKind } from '../src';
import type { INpcFactory, NpcData } from '../src';
import type { NpcContext, NpcState } from '../src';
import type { NpcDeps } from '../src/types';

import { createMockedActorNpcRegistry } from './actor-npc-registry';
import { createMockedNpcWorldKnowledge } from './world-knowledge';

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
    needs: createNeedValues(),
    addictions: createAddictionsData(),
    ...data,
  };
}

/** Создаёт зависимости NPC. Зависимости, которые не переданы, заполняются незначимыми значениями */
export function createNpcDeps(deps: Partial<NpcDeps> = {}): NpcDeps {
  return {
    actor: createActor(),
    actorNpcRegistry: createMockedActorNpcRegistry(),
    htn: createMockedHTN<NpcState, NpcContext>(),
    inventory: new Inventory(),
    psyche: new Psyche(createPsycheState(), createPsycheDeps()),
    needs: new Needs(createNeedsState(), createNeedsDeps()),
    addictions: new Addictions(createAddictionsState(), createAddictionsDeps()),
    urgencyWatcher: createMockedUrgencyWatcher(),
    ticks: createControlledObservable().observable,
    worldKnowledge: createMockedNpcWorldKnowledge(),
    gameSignal: new AbortController().signal,
    ...deps,
  };
}

/** Создаёт фабрику NPC, которая создаёт NPC по данным с незначительными зависимостями */
export function createMockedNpcFactory(): Mocked<INpcFactory> {
  return {
    create: vi.fn((data: NpcData) => new Npc(data, createNpcDeps())),
  };
}
