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
      it('NPC на тике мира планирует корневую задачу, которую вернула rootTaskFactory', async () => {
        const ticks = createControlledObservable();
        const preconditions = vi.fn(() => false);
        const world = new World(
          createWorldOptions({
            game: createGame({ ticks: ticks.observable }),
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

        ticks.subscriber.next(undefined);

        expect(preconditions).toHaveBeenCalled();
      });

      it('Если rootTaskFactory не передана, задачи бомжа получают места из placesFactory', async () => {
        const ticks = createControlledObservable();
        const worldPlaces = createMockedPlaces();
        const world = new World(
          createWorldOptions({
            game: createGame({ ticks: ticks.observable }),
            npcs: [createNpcData({ kind: NpcKind.Homeless })],
          }),
          { placesFactory: { create: () => worldPlaces } }
        );
        await world.bigBang();

        ticks.subscriber.next(undefined);

        expect(worldPlaces.ofType).toHaveBeenCalled();
      });
    });
  });
});
