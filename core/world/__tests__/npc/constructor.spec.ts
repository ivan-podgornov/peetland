import type { Task } from '@peetland/htn';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Inventory, Item } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';
import type { NpcContext, NpcState } from '../../src';

import { createNpcData, createNpcDeps } from './helpers';

describe('Npc', () => {
  describe('#constructor', () => {
    it('Создаёт актора с моделью, позицией и углом спавна из данных', () => {
      const actorFactory = createMockedActorFactory();
      const data = createNpcData({
        modelId: 78,
        spawnPosition: { x: 1, y: 2, z: 3 },
        spawnAngle: 90,
      });

      new Npc(data, createNpcDeps({ actorFactory }));

      expect(actorFactory.create).toHaveBeenCalledExactlyOnceWith({
        modelId: data.modelId,
        position: data.spawnPosition,
        angle: data.spawnAngle,
      });
    });

    it('Вызывает inventoryFactory.create с начальным содержимым инвентаря из данных', () => {
      const inventoryFactory = createMockedInventoryFactory();
      const data = createNpcData({ inventory: { [Item.Money]: 150 } });

      new Npc(data, createNpcDeps({ inventoryFactory }));

      expect(inventoryFactory.create).toHaveBeenCalledExactlyOnceWith(data.inventory);
    });

    it('Использует инвентарь, который вернула inventoryFactory', () => {
      const inventory = new Inventory();

      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ inventoryFactory: createMockedInventoryFactory(inventory) })
      );

      expect(npc.inventory).toBe(inventory);
    });

    it('Берёт черты характера из данных', () => {
      const data = createNpcData({ traits: { conscientiousness: 80 } });

      const npc = new Npc(data, createNpcDeps());

      expect(npc.traits).toStrictEqual(data.traits);
    });

    it('Берёт начальные чувства из данных', () => {
      const data = createNpcData({ feelings: { shame: 30 } });

      const npc = new Npc(data, createNpcDeps());

      expect(npc.feelings).toStrictEqual(data.feelings);
    });

    it('Создаёт HTN-агента с корневой задачей', () => {
      const rootTask: Task<NpcState, NpcContext> = { name: 'root', methods: [] };
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();

      new Npc(createNpcData(), createNpcDeps({ htnFactory, rootTask }));

      expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(rootTask);
    });

    it('Не обновляет HTN-агента, пока не наступил кадр', () => {
      const htn = createMockedHTN<NpcState, NpcContext>();

      new Npc(createNpcData(), createNpcDeps({ htnFactory: createMockedHTNFactory(htn) }));

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
