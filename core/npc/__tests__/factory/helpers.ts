import { AbortController } from '@peetland/events';
import { createControlledObservable } from '@peetland/events/dev';
import { ManualTime } from '@peetland/timings';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';

import { createMockedActorNpcRegistry, createMockedNpcWorldKnowledgeFactory } from '../../dev';
import type { NpcFactoryDeps } from '../../src';

/** Создаёт зависимости фабрики NPC, без которых она не собирается. Остальное — по умолчанию */
export function createRequiredDeps(deps: Partial<NpcFactoryDeps> = {}): NpcFactoryDeps {
  return {
    actorFactory: createMockedActorFactory(),
    actorNpcRegistry: createMockedActorNpcRegistry(),
    ticks: createControlledObservable().observable,
    rootTaskFactory: {
      create: vi.fn(() => ({
        name: 'root',
        methods: [],
      })),
    },
    time: new ManualTime(),
    worldKnowledgeFactory: createMockedNpcWorldKnowledgeFactory(),
    gameSignal: new AbortController().signal,
    ...deps,
  };
}
