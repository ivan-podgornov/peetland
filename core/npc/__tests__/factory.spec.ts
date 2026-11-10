import { AbortController } from '@peetland/events';
import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { Inventory } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { Needs } from '@peetland/needs';
import { createMockedNeedsFactory } from '@peetland/needs/dev';
import { Psyche } from '@peetland/psyche';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData, createNpcDeps } from '../dev';
import { Npc, NpcFactory } from '../src';
import type { NpcContext, NpcFactoryDeps, NpcState } from '../src';

/** Создаёт зависимости фабрики NPC, без которых она не собирается. Остальное — по умолчанию */
function createRequiredDeps(deps: Partial<NpcFactoryDeps> = {}): NpcFactoryDeps {
  return {
    actorFactory: createMockedActorFactory(),
    ticks: createControlledObservable().observable,
    rootTaskFactory: {
      create: vi.fn(() => ({
        name: 'root',
        methods: [],
      })),
    },
    worldKnowledge: createMockedNpcWorldKnowledge(),
    gameSignal: new AbortController().signal,
    ...deps,
  };
}

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createNpcDeps());

      const npc = factory.create(createNpcData());

      expect(npc).toBeInstanceOf(Npc);
    });

    it('NPC создаёт HTN-агента фабрикой htnFactory из зависимостей', () => {
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
      const factory = new NpcFactory(createRequiredDeps({ htnFactory }));

      factory.create(createNpcData());

      expect(htnFactory.create).toHaveBeenCalledOnce();
    });

    it('NPC создаёт инвентарь фабрикой inventoryFactory из зависимостей', () => {
      const inventoryFactory = createMockedInventoryFactory();
      const factory = new NpcFactory(createRequiredDeps({ inventoryFactory }));

      factory.create(createNpcData());

      expect(inventoryFactory.create).toHaveBeenCalledOnce();
    });

    it('NPC создаёт психику фабрикой psycheFactory из зависимостей', () => {
      const psycheFactory = createMockedPsycheFactory();
      const factory = new NpcFactory(createRequiredDeps({ psycheFactory }));

      factory.create(createNpcData());

      expect(psycheFactory.create).toHaveBeenCalledOnce();
    });

    it('NPC создаёт потребности фабрикой needsFactory из зависимостей', () => {
      const needsFactory = createMockedNeedsFactory();
      const factory = new NpcFactory(createRequiredDeps({ needsFactory }));

      factory.create(createNpcData());

      expect(needsFactory.create).toHaveBeenCalledOnce();
    });

    it('Если inventoryFactory не передана, NPC получает экземпляр Inventory', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.inventory).toBeInstanceOf(Inventory);
    });

    it('Если psycheFactory не передана, NPC получает экземпляр Psyche', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.psyche).toBeInstanceOf(Psyche);
    });

    it('Если needsFactory не передана, NPC получает экземпляр Needs', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.needs).toBeInstanceOf(Needs);
    });
  });
});
