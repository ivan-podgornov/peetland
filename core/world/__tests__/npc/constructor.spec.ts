import type { Task } from '@peetland/htn';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Inventory, Item } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { Feeling, Psyche } from '@peetland/psyche';
import {
  createMockedPsycheFactory,
  createPsycheDeps,
  createPsycheState,
} from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { Npc } from '../../src';
import type { NpcContext, NpcState } from '../../src';
import { createMockedPlaces } from '../places/helpers';

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

    it('Вызывает psycheFactory.create с начальным состоянием психики из данных', () => {
      const psycheFactory = createMockedPsycheFactory();
      const data = createNpcData({
        psyche: createPsycheState({
          feelings: { [Feeling.Shame]: 30 },
        }),
      });

      new Npc(data, createNpcDeps({ psycheFactory }));

      expect(psycheFactory.create).toHaveBeenCalledExactlyOnceWith(data.psyche);
    });

    it('Использует психику, которую вернула psycheFactory', () => {
      const psyche = new Psyche(createPsycheState(), createPsycheDeps());

      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ psycheFactory: createMockedPsycheFactory(psyche) })
      );

      expect(npc.psyche).toBe(psyche);
    });

    it('Вызывает rootTaskFactory.create с местами из зависимостей', () => {
      const rootTaskFactory = { create: vi.fn(() => ({ name: 'root', methods: [] })) };
      const places = createMockedPlaces();

      new Npc(createNpcData(), createNpcDeps({ rootTaskFactory, places }));

      expect(rootTaskFactory.create).toHaveBeenCalledExactlyOnceWith({ places });
    });

    it('Создаёт HTN-агента с корневой задачей, которую вернула rootTaskFactory', () => {
      const rootTask: Task<NpcState, NpcContext> = { name: 'root', methods: [] };
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();

      new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory, rootTaskFactory: { create: () => rootTask } })
      );

      expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(rootTask);
    });

    it('Не обновляет HTN-агента, пока не наступил кадр', () => {
      const htn = createMockedHTN<NpcState, NpcContext>();

      new Npc(createNpcData(), createNpcDeps({ htnFactory: createMockedHTNFactory(htn) }));

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
