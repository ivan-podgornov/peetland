import { createControlledObservable } from '@peetland/events/dev';
import type { CompoundTask } from '@peetland/htn';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { Inventory, Item } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { Psyche } from '@peetland/psyche';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc, NpcFactory } from '../src';
import type { NpcContext, NpcFactoryDeps, NpcState } from '../src';

/** Создаёт зависимости фабрики NPC, без которых она не собирается. Остальное — по умолчанию */
function createRequiredDeps(deps: Partial<NpcFactoryDeps> = {}): NpcFactoryDeps {
  return {
    actorFactory: createMockedActorFactory(),
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

    it('Если htnFactory не передана, NPC на кадре планирует свою корневую задачу', () => {
      const frames = createControlledObservable();
      const preconditions = vi.fn(() => false);
      const rootTask: CompoundTask<NpcState, NpcContext> = {
        name: 'root',
        methods: [
          {
            name: 'never',
            preconditions,
            tasks: [],
          },
        ],
      };
      const factory = new NpcFactory(
        createRequiredDeps({
          frames: frames.observable,
          rootTaskFactory: { create: () => rootTask },
        })
      );
      factory.create(createNpcData());

      frames.subscriber.next(undefined);

      expect(preconditions).toHaveBeenCalled();
    });

    it('Если inventoryFactory не передана, NPC получает инвентарь с содержимым из данных', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData({ inventory: { [Item.Money]: 150 } }));

      expect(npc.inventory).toBeInstanceOf(Inventory);
      expect(npc.inventory.getAll()).toStrictEqual({ [Item.Money]: 150 });
    });

    it('Если psycheFactory не передана, NPC получает экземпляр Psyche', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.psyche).toBeInstanceOf(Psyche);
    });
  });
});
