import { plan, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { BOTTLES_FOR_BOOZE, createPlacesWithCollection, createSellBottlesTask } from '../../../dev';

/** Создаёт состояние NPC, у которого бутылок хватает на пойло: без них план не составляется */
function createStateWithBottles() {
  return new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build();
}

describe('SellBottlesTask', () => {
  describe('Метод sell-in-nearest-collection', () => {
    describe('Задачи', () => {
      it('Планирует дойти до приёмки, повернуться к приёмщику, а отдать бутылки и получить деньги — одной транзакцией', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());

        expect(planTree(planSteps(task, createStateWithBottles()) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('sell-bottles', 'sell-in-nearest-collection', (sell) =>
              sell
                .primitive('go-to-coords')
                .primitive('achieve-angle')
                .transaction('hand-over-bottles', 'hand-over-bottles', (handOver) =>
                  handOver
                    .primitive('play-animation')
                    .primitive('remove-item')
                    .primitive('add-item')
                )
            )
            .build()
        );
      });

      it('Ищет приёмку, ближайшую к позиции NPC из состояния', () => {
        const places = createPlacesWithCollection();
        const state = new NpcStateBuilder()
          .withPosition(8, 0, 0)
          .withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE })
          .build();

        plan(createSellBottlesTask(places), state);

        expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
          {
            x: 8,
            y: 0,
            z: 0,
          },
          PlaceType.BottleCollection
        );
      });

      it('Идёт к приёмке, которую вернул places.findNearest', () => {
        const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
        const collection = createPlace({
          type: PlaceType.BottleCollection,
          position: {
            x: 50,
            y: 0,
            z: 0,
          },
        });
        const task = createSellBottlesTask(
          createPlacesWithCollection(collection),
          createNpcTaskFactory({ goToCoords })
        );

        plan(task, createStateWithBottles());

        expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
          coords: {
            x: 50,
            y: 0,
            z: 0,
          },
          completeRadius: 0.5,
        });
      });

      it('Поворачивается лицом к приёмщику приёмки, которую вернул places.findNearest', () => {
        const achieveAngle = vi.fn(() => createStubNpcTask('achieve-angle'));
        const collection = createPlace({
          type: PlaceType.BottleCollection,
          angle: 90,
        });
        const task = createSellBottlesTask(
          createPlacesWithCollection(collection),
          createNpcTaskFactory({ achieveAngle })
        );

        plan(task, createStateWithBottles());

        expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
          angle: 90,
          tolerance: 15,
        });
      });
    });
  });
});
