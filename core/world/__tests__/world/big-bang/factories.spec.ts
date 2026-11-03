import { createMockedNpcFactory, createNpcData } from '@peetland/npc/dev';
import { createMockedPlaces, createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createWorldOptions } from '../../../dev';
import { World } from '../../../src';

describe('World', () => {
  describe('#bigBang', () => {
    it('Вызывает npcFactory.create с данными каждой записи репозитория NPC', async () => {
      const npcFactory = createMockedNpcFactory();
      const peet = createNpcData({ id: 'peet' });
      const joe = createNpcData({ id: 'joe' });
      const world = new World(createWorldOptions({ npcs: [peet, joe] }), { npcFactory });

      await world.bigBang();

      expect(npcFactory.create.mock.calls.map(([data]) => data)).toStrictEqual([peet, joe]);
    });

    it('Если в репозитории NPC нет записей, не вызывает npcFactory.create', async () => {
      const npcFactory = createMockedNpcFactory();
      const world = new World(createWorldOptions(), { npcFactory });

      await world.bigBang();

      expect(npcFactory.create).not.toHaveBeenCalled();
    });

    it('Вызывает placesFactory.create с местами из репозитория мест', async () => {
      const placesFactory = { create: vi.fn(() => createMockedPlaces()) };
      const places = [createPlace({ id: 'shop' }), createPlace({ id: 'trash' })];
      const world = new World(createWorldOptions({ places }), {
        npcFactory: createMockedNpcFactory(),
        placesFactory,
      });

      await world.bigBang();

      expect(placesFactory.create).toHaveBeenCalledExactlyOnceWith({ places });
    });
  });
});
