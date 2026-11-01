import { createMockedHTNFactory } from '@peetland/htn/dev';
import { describe, expect, it, vi } from 'vitest';

import { Npc, NpcFactory } from '../../src';
import type { NpcContext, NpcState } from '../../src';
import { createMockedPlaces } from '../places/helpers';

import { createNpcData, createNpcFactoryDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createNpcFactoryDeps());

      const npc = factory.create(createNpcData(), { places: createMockedPlaces() });

      expect(npc).toBeInstanceOf(Npc);
    });

    it('Вызывает rootTaskFactory.create с переданными местами', () => {
      const rootTaskFactory = { create: vi.fn(() => ({ name: 'root', methods: [] })) };
      const places = createMockedPlaces();
      const factory = new NpcFactory(createNpcFactoryDeps({ rootTaskFactory }));

      factory.create(createNpcData(), { places });

      expect(rootTaskFactory.create).toHaveBeenCalledExactlyOnceWith({ places });
    });

    it('Создаёт HTN-агента NPC с корневой задачей, которую вернула rootTaskFactory', () => {
      const rootTask = { name: 'root', methods: [] };
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
      const factory = new NpcFactory(
        createNpcFactoryDeps({ htnFactory, rootTaskFactory: { create: () => rootTask } })
      );

      factory.create(createNpcData(), { places: createMockedPlaces() });

      expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(rootTask);
    });
  });
});
