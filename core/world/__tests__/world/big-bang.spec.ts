import { createMockedNpcFactory, createNpcData } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { World } from '../../src';

import { createWorldDeps } from './helpers';

describe('World', () => {
  describe('#bigBang', () => {
    it('Вызывает npcFactory.create с данными каждой записи репозитория NPC', async () => {
      const npcFactory = createMockedNpcFactory();
      const peet = createNpcData({ id: 'peet' });
      const joe = createNpcData({ id: 'joe' });
      const world = new World(
        createWorldDeps({
          npcs: [peet, joe],
          npcFactory,
        })
      );

      await world.bigBang();

      expect(npcFactory.create.mock.calls.map(([data]) => data)).toStrictEqual([peet, joe]);
    });

    it('Если в репозитории NPC нет записей, не вызывает npcFactory.create', async () => {
      const npcFactory = createMockedNpcFactory();
      const world = new World(createWorldDeps({ npcFactory }));

      await world.bigBang();

      expect(npcFactory.create).not.toHaveBeenCalled();
    });
  });
});
