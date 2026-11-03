import { NpcKind } from '@peetland/npc';
import { createNpcData } from '@peetland/npc/dev';
import { Feeling } from '@peetland/psyche';
import { createMockedPsycheFactory, createPsycheState } from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createGame, createWorldOptions, createMockedRootTaskFactory } from '../../../dev';
import { World } from '../../../src';

describe('World', () => {
  describe('#bigBang', () => {
    describe('Если npcFactory не передана', () => {
      it('NPC создаёт актора фабрикой акторов игры', async () => {
        const actorFactory = createMockedActorFactory();
        const world = new World(
          createWorldOptions({
            game: createGame({ actorFactory }),
            npcs: [createNpcData({ modelId: 78 })],
          }),
          { rootTaskFactory: createMockedRootTaskFactory() }
        );

        await world.bigBang();

        expect(actorFactory.create).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({ modelId: 78 })
        );
      });

      it('NPC создаёт психику фабрикой psycheFactory', async () => {
        const psycheFactory = createMockedPsycheFactory();
        const data = createNpcData({
          psyche: createPsycheState({ feelings: { [Feeling.Shame]: 30 } }),
        });
        const world = new World(createWorldOptions({ npcs: [data] }), {
          psycheFactory,
          rootTaskFactory: createMockedRootTaskFactory(),
        });

        await world.bigBang();

        expect(psycheFactory.create).toHaveBeenCalledExactlyOnceWith(data.psyche);
      });

      it('NPC вызывает rootTaskFactory.create со своим типом', async () => {
        const rootTaskFactory = createMockedRootTaskFactory();
        const world = new World(
          createWorldOptions({ npcs: [createNpcData({ kind: NpcKind.Homeless })] }),
          { rootTaskFactory }
        );

        await world.bigBang();

        expect(rootTaskFactory.create).toHaveBeenCalledExactlyOnceWith(NpcKind.Homeless);
      });
    });
  });
});
