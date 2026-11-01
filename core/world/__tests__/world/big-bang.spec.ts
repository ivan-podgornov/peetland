import { describe, expect, it } from 'vitest';

import { World } from '../../src';
import { createNpcData } from '../npc/helpers';
import { createMockedPlaces } from '../places/helpers';
import { createPlace } from '../tasks/helpers';

import { createMockedNpcFactory, createMockedPlacesFactory, createWorldDeps } from './helpers';

describe('World', () => {
  describe('#bigBang', () => {
    it('Вызывает npcFactory.create с данными каждой записи репозитория NPC', async () => {
      const npcFactory = createMockedNpcFactory();
      const peet = createNpcData({ id: 'peet' });
      const joe = createNpcData({ id: 'joe' });
      const world = new World(createWorldDeps({ npcs: [peet, joe], npcFactory }));

      await world.bigBang();

      expect(npcFactory.create.mock.calls.map(([data]) => data)).toStrictEqual([peet, joe]);
    });

    it('Вызывает placesFactory.create с местами из репозитория мест', async () => {
      const placesFactory = createMockedPlacesFactory();
      const places = [createPlace({ id: 'shop' }), createPlace({ id: 'bin' })];
      const world = new World(createWorldDeps({ places, placesFactory }));

      await world.bigBang();

      expect(placesFactory.create).toHaveBeenCalledExactlyOnceWith({ places });
    });

    it('Вызывает npcFactory.create с местами, которые вернула placesFactory', async () => {
      const npcFactory = createMockedNpcFactory();
      const places = createMockedPlaces();
      const world = new World(
        createWorldDeps({
          npcs: [createNpcData()],
          placesFactory: createMockedPlacesFactory(places),
          npcFactory,
        })
      );

      await world.bigBang();

      expect(npcFactory.create).toHaveBeenCalledExactlyOnceWith(expect.anything(), { places });
    });

    it('Если в репозитории NPC нет записей, не вызывает npcFactory.create', async () => {
      const npcFactory = createMockedNpcFactory();
      const world = new World(createWorldDeps({ npcFactory }));

      await world.bigBang();

      expect(npcFactory.create).not.toHaveBeenCalled();
    });
  });
});
