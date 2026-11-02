import { createControlledObservable } from '@peetland/events/dev';
import { HomelessRootTask } from '@peetland/homeless';
import type { Task } from '@peetland/htn';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { NpcKind } from '@peetland/npc';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedNpcFactory, createNpcData } from '@peetland/npc/dev';
import { createMockedPlaces, createPlace } from '@peetland/places/dev';
import { Feeling } from '@peetland/psyche';
import { createMockedPsycheFactory, createPsycheState } from '@peetland/psyche/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { World } from '../../src';

import { createGame, createWorldOptions } from './helpers';

/** Создаёт фабрику корневых задач, которая всегда возвращает переданную задачу */
function createMockedRootTaskFactory(
  task: Task<NpcState, NpcContext> = {
    name: 'root',
    methods: [],
  }
) {
  return { create: vi.fn(() => task) };
}

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

      it('NPC обновляет HTN-агента на кадрах игры', async () => {
        const frames = createControlledObservable();
        const htn = createMockedHTN<NpcState, NpcContext>();
        const world = new World(
          createWorldOptions({
            game: createGame({ frames: frames.observable }),
            npcs: [createNpcData()],
          }),
          {
            htnFactory: createMockedHTNFactory(htn),
            rootTaskFactory: createMockedRootTaskFactory(),
          }
        );
        await world.bigBang();

        frames.subscriber.next(undefined);

        expect(htn.update).toHaveBeenCalledOnce();
      });

      it('NPC создаёт инвентарь фабрикой inventoryFactory', async () => {
        const inventoryFactory = createMockedInventoryFactory();
        const data = createNpcData({ inventory: { [Item.Money]: 150 } });
        const world = new World(createWorldOptions({ npcs: [data] }), {
          inventoryFactory,
          rootTaskFactory: createMockedRootTaskFactory(),
        });

        await world.bigBang();

        expect(inventoryFactory.create).toHaveBeenCalledExactlyOnceWith(data.inventory);
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

      it('NPC создаёт HTN-агента фабрикой htnFactory с задачей, которую вернула rootTaskFactory', async () => {
        const rootTask: Task<NpcState, NpcContext> = {
          name: 'root',
          methods: [],
        };
        const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
        const world = new World(createWorldOptions({ npcs: [createNpcData()] }), {
          htnFactory,
          rootTaskFactory: createMockedRootTaskFactory(rootTask),
        });

        await world.bigBang();

        expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(rootTask);
      });

      it('Если rootTaskFactory не передана, бомж получает корневую задачу бомжа', async () => {
        const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
        const world = new World(
          createWorldOptions({ npcs: [createNpcData({ kind: NpcKind.Homeless })] }),
          { htnFactory }
        );

        await world.bigBang();

        expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(expect.any(HomelessRootTask));
      });
    });
  });
});
