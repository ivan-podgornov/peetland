import type { Task } from '@peetland/htn';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';
import type { NpcState } from '../../src';

import { createMockedRootTaskFactory, createNpcData, createNpcDeps } from './helpers';

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

    it('Заполняет инвентарь начальным содержимым из данных', () => {
      const data = createNpcData({ inventory: { [Item.Money]: 150 } });

      const npc = new Npc(data, createNpcDeps());

      expect(npc.inventory.getAll()).toStrictEqual(data.inventory);
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

    it('Создаёт корневую задачу для своего актора', () => {
      const actor = createActor();
      const rootTaskFactory = createMockedRootTaskFactory();

      new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor), rootTaskFactory })
      );

      expect(rootTaskFactory.create).toHaveBeenCalledExactlyOnceWith(actor);
    });

    it('Создаёт HTN-агента с корневой задачей', () => {
      const root: Task<NpcState> = { name: 'root', methods: [] };
      const htnFactory = createMockedHTNFactory<NpcState>();

      new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory, rootTaskFactory: createMockedRootTaskFactory(root) })
      );

      expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(root);
    });

    it('Не обновляет HTN-агента, пока не наступил кадр', () => {
      const htn = createMockedHTN<NpcState>();

      new Npc(createNpcData(), createNpcDeps({ htnFactory: createMockedHTNFactory(htn) }));

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
