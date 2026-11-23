import { Npc } from '@peetland/npc';
import { createNpcData } from '@peetland/npc/dev';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createGame, createMockedRootTaskFactory, createWorldOptions } from '../../../dev';
import { ActorNpcRegistry, World } from '../../../src';

describe('World', () => {
  describe('#bigBang', () => {
    it('NPC связывают своих акторов с собой в реестре связей', async () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
      const world = new World(
        createWorldOptions({
          game: createGame({ actorFactory: createMockedActorFactory(actor) }),
          npcs: [createNpcData({ id: 'peet' })],
        }),
        {
          actorNpcRegistry,
          rootTaskFactory: createMockedRootTaskFactory(),
        }
      );

      await world.bigBang();

      const npc = actorNpcRegistry.getNpc(actor)!;
      expect(npc).toBeInstanceOf(Npc);
      expect(actorNpcRegistry.getActor(npc)).toBe(actor);
    });
  });
});
