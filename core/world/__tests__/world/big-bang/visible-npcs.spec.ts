import type { IActor, IActorFactory } from '@peetland/game';
import { createNpcData } from '@peetland/npc/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createGame, createMockedRootTaskFactory, createWorldOptions } from '../../../dev';
import { ActorNpcRegistry } from '../../../src/actor-npc-registry';
import { NpcWorldKnowledge } from '../../../src/npc-world-knowledge';
import { World } from '../../../src/world';

describe('World', () => {
  describe('#bigBang', () => {
    it('NPC через знание о мире видят других NPC, а акторов без личности нет', async () => {
      const actors: IActor[] = [];
      const actorFactory: IActorFactory = {
        create: vi.fn(() => {
          const actor = createActor();
          actors.push(actor);

          return actor;
        }),
      };
      const game = createGame({
        actorFactory,
        getVisibleActors: vi.fn((target: IActor) => [
          ...actors.filter((actor) => actor !== target),
          createActor(),
        ]),
      });
      const actorNpcRegistry = new ActorNpcRegistry();
      const worldKnowledge = new NpcWorldKnowledge({
        time: game.time,
        game,
        actorNpcRegistry,
      });
      const world = new World(
        createWorldOptions({
          game,
          npcs: [createNpcData({ id: 'peet' }), createNpcData({ id: 'cj' })],
        }),
        {
          actorNpcRegistry,
          worldKnowledge,
          rootTaskFactory: createMockedRootTaskFactory(),
        }
      );

      await world.bigBang();

      const peet = actorNpcRegistry.getNpc(actors[0]!)!;
      const cj = actorNpcRegistry.getNpc(actors[1]!)!;
      expect(peet.id).toBe('peet');
      expect(cj.id).toBe('cj');
      expect(worldKnowledge.getVisibleNpcs(peet, 10)).toEqual([cj]);
    });
  });
});
