import { createControlledObservable } from '@peetland/events/dev';
import type { Task } from '@peetland/htn';
import { NpcKind } from '@peetland/npc';
import type { NpcContext, NpcState } from '@peetland/npc';
import {
  createMockedNpcFactory,
  createMockedNpcWorldKnowledge,
  createNpcData,
} from '@peetland/npc/dev';
import { createMockedPlaces, createPlace } from '@peetland/places/dev';
import { Feeling } from '@peetland/psyche';
import { createMockedPsycheFactory, createPsycheState } from '@peetland/psyche/dev';
import { ManualTime } from '@peetland/timings';
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

      it('NPC на кадре игры планирует корневую задачу, которую вернула rootTaskFactory', async () => {
        const frames = createControlledObservable();
        const preconditions = vi.fn(() => false);
        const world = new World(
          createWorldOptions({
            game: createGame({ frames: frames.observable }),
            npcs: [createNpcData()],
          }),
          {
            rootTaskFactory: createMockedRootTaskFactory({
              name: 'root',
              methods: [
                {
                  name: 'never',
                  preconditions,
                  tasks: [],
                },
              ],
            }),
          }
        );
        await world.bigBang();

        frames.subscriber.next(undefined);

        expect(preconditions).toHaveBeenCalled();
      });

      it('NPC планирует с тем, что вернуло worldKnowledge', async () => {
        const frames = createControlledObservable();
        const preconditions = vi.fn(() => false);
        const world = new World(
          createWorldOptions({
            game: createGame({ frames: frames.observable }),
            npcs: [createNpcData()],
          }),
          {
            worldKnowledge: createMockedNpcWorldKnowledge({ time: 20 * 60 + 15 }),
            rootTaskFactory: createMockedRootTaskFactory({
              name: 'root',
              methods: [
                {
                  name: 'never',
                  preconditions,
                  tasks: [],
                },
              ],
            }),
          }
        );
        await world.bigBang();

        frames.subscriber.next(undefined);

        expect(preconditions).toHaveBeenCalledWith(
          expect.objectContaining({ world: { time: 20 * 60 + 15 } })
        );
      });

      it('Если worldKnowledge не передано, NPC планирует с временем суток игры', async () => {
        const frames = createControlledObservable();
        const preconditions = vi.fn(() => false);
        const world = new World(
          createWorldOptions({
            game: createGame({
              time: new ManualTime(20, 15),
              frames: frames.observable,
            }),
            npcs: [createNpcData()],
          }),
          {
            rootTaskFactory: createMockedRootTaskFactory({
              name: 'root',
              methods: [
                {
                  name: 'never',
                  preconditions,
                  tasks: [],
                },
              ],
            }),
          }
        );
        await world.bigBang();

        frames.subscriber.next(undefined);

        expect(preconditions).toHaveBeenCalledWith(
          expect.objectContaining({ world: { time: 20 * 60 + 15 } })
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

      it('Если rootTaskFactory не передана, задачи бомжа получают места из placesFactory', async () => {
        const frames = createControlledObservable();
        const worldPlaces = createMockedPlaces();
        const world = new World(
          createWorldOptions({
            game: createGame({ frames: frames.observable }),
            npcs: [createNpcData({ kind: NpcKind.Homeless })],
          }),
          { placesFactory: { create: () => worldPlaces } }
        );
        await world.bigBang();

        frames.subscriber.next(undefined);

        expect(worldPlaces.ofType).toHaveBeenCalled();
      });
    });
  });
});
