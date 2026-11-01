import { createControlledObservable } from '@peetland/events/dev';
import { Item } from '@peetland/inventory';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, World } from '../../src';
import { createNpcData } from '../npc/helpers';
import { createPlace } from '../tasks/helpers';

import { createGame, createWorldDeps } from './helpers';

describe('World', () => {
  describe('#bigBang', () => {
    it('Возвращает по NPC на каждую запись репозитория NPC', async () => {
      const world = new World(
        createWorldDeps({ npcs: [createNpcData({ id: 'peet' }), createNpcData({ id: 'joe' })] })
      );

      const npcs = await world.bigBang();

      expect(npcs.map((npc) => npc.id)).toStrictEqual(['peet', 'joe']);
    });

    it('Если в репозитории NPC нет записей, не создаёт акторов', async () => {
      const actorFactory = createMockedActorFactory();
      const world = new World(createWorldDeps({ game: createGame({ actorFactory }) }));

      await world.bigBang();

      expect(actorFactory.create).not.toHaveBeenCalled();
    });

    it('Создаёт актора NPC фабрикой акторов игры по данным NPC', async () => {
      const actorFactory = createMockedActorFactory();
      const data = createNpcData({
        modelId: 78,
        spawnPosition: { x: 1, y: 2, z: 3 },
        spawnAngle: 90,
      });
      const world = new World(
        createWorldDeps({ game: createGame({ actorFactory }), npcs: [data] })
      );

      await world.bigBang();

      expect(actorFactory.create).toHaveBeenCalledExactlyOnceWith({
        modelId: 78,
        position: { x: 1, y: 2, z: 3 },
        angle: 90,
      });
    });

    it('Создаёт NPC с инвентарём из данных NPC', async () => {
      const data = createNpcData({ inventory: { [Item.Money]: 300 } });
      const world = new World(createWorldDeps({ npcs: [data] }));

      const [npc] = await world.bigBang();

      expect(npc?.inventory.get(Item.Money)).toBe(300);
    });

    it('Если NPC хватает денег на пойло, на кадр он идёт в магазин из репозитория мест', async () => {
      const frames = createControlledObservable();
      const actor = createActor();
      const goToCoords = vi.spyOn(actor, 'goToCoords');
      const world = new World(
        createWorldDeps({
          game: createGame({ actorFactory: createMockedActorFactory(actor) }),
          npcs: [createNpcData({ inventory: { [Item.Money]: BOOZE_PRICE } })],
          places: [createPlace({ position: { x: 10, y: 20, z: 0 } })],
          frames: frames.observable,
        })
      );

      await world.bigBang();
      frames.subscriber.next(undefined);

      expect(goToCoords).toHaveBeenCalledWith({ x: 10, y: 20, z: 0 }, expect.any(Number));
    });

    it('Если в репозитории мест нет магазинов, на кадр NPC с деньгами никуда не идёт', async () => {
      const frames = createControlledObservable();
      const actor = createActor();
      const goToCoords = vi.spyOn(actor, 'goToCoords');
      const world = new World(
        createWorldDeps({
          game: createGame({ actorFactory: createMockedActorFactory(actor) }),
          npcs: [createNpcData({ inventory: { [Item.Money]: BOOZE_PRICE } })],
          frames: frames.observable,
        })
      );

      await world.bigBang();
      frames.subscriber.next(undefined);

      expect(goToCoords).not.toHaveBeenCalled();
    });
  });
});
