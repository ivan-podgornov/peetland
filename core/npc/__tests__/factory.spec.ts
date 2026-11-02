import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNpcData } from '../dev';
import { Npc, NpcFactory } from '../src';

import { createNpcFactoryDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createNpcFactoryDeps());

      const npc = factory.create(createNpcData(), { places: createMockedPlaces() });

      expect(npc).toBeInstanceOf(Npc);
    });

    it('Создаёт NPC с переданными местами', () => {
      const rootTaskFactory = {
        create: vi.fn(() => ({
          name: 'root',
          methods: [],
        })),
      };
      const places = createMockedPlaces();
      const factory = new NpcFactory(createNpcFactoryDeps({ rootTaskFactory }));

      factory.create(createNpcData(), { places });

      expect(rootTaskFactory.create).toHaveBeenCalledExactlyOnceWith({ places });
    });
  });
});
