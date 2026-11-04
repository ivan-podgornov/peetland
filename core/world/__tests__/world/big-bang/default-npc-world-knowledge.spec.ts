import { createControlledObservable } from '@peetland/events/dev';
import { createMockedNpcWorldKnowledge, createNpcData } from '@peetland/npc/dev';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createGame, createWorldOptions, createMockedRootTaskFactory } from '../../../dev';
import { World } from '../../../src';

describe('World', () => {
  describe('#bigBang', () => {
    describe('Если npcFactory не передана', () => {
      it('NPC планирует с тем, что вернуло worldKnowledge', async () => {
        const ticks = createControlledObservable();
        const preconditions = vi.fn(() => false);
        const world = new World(
          createWorldOptions({
            game: createGame({ ticks: ticks.observable }),
            npcs: [createNpcData()],
          }),
          {
            worldKnowledge: createMockedNpcWorldKnowledge({
              time: {
                day: 1,
                hours: 20,
                minutes: 15,
              },
            }),
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

        expect(preconditions).toHaveBeenCalledWith(
          expect.objectContaining({
            world: {
              time: {
                day: 1,
                hours: 20,
                minutes: 15,
              },
            },
          })
        );
      });

      it('Если worldKnowledge не передано, NPC планирует с временем суток игры', async () => {
        const ticks = createControlledObservable();
        const preconditions = vi.fn(() => false);
        const world = new World(
          createWorldOptions({
            game: createGame({
              time: new ManualTime({
                day: 1,
                hours: 20,
                minutes: 15,
              }),
              ticks: ticks.observable,
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

        ticks.subscriber.next(undefined);

        expect(preconditions).toHaveBeenCalledWith(
          expect.objectContaining({
            world: {
              time: {
                day: 1,
                hours: 20,
                minutes: 15,
              },
            },
          })
        );
      });
    });
  });
});
