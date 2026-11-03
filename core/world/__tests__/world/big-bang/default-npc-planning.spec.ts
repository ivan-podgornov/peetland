import { createControlledObservable } from '@peetland/events/dev';
import { NpcKind } from '@peetland/npc';
import { createNpcData } from '@peetland/npc/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createGame, createWorldOptions, createMockedRootTaskFactory } from '../../../dev';
import { World } from '../../../src';

describe('World', () => {
  describe('#bigBang', () => {
    describe('Если npcFactory не передана', () => {
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
