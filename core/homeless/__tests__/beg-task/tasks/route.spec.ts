import { plan, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { PlayAnimationTaskOptions } from '@peetland/npc-tasks';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import {
  createBeggingOptimism,
  createBegTask,
  createPlacesWithBeggingSpot,
  withBeggingTraits,
} from '../../../dev';

/** Состояние NPC, который, по ожиданию, успеет получить ровно одну подачку: после неё стыд 30, а после второй — 60 */
function createStateForOneReward() {
  return new NpcStateBuilder()
    .withPsyche((psyche) => withBeggingTraits(psyche, 1, createBeggingOptimism(30)).build())
    .build();
}

describe('BegTask', () => {
  describe('Метод beg-at-nearest-spot', () => {
    describe('Задачи', () => {
      it('Планирует дойти до места, повернуться и попрошайничать', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = createStateForOneReward();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('beg', 'beg-at-nearest-spot', (beg) =>
              beg
                .primitive('go-to-coords')
                .primitive('achieve-angle')
                .primitive('parallel')
                .primitive('add-item')
            )
            .build()
        );
      });

      it('Ищет место для попрошайничества, ближайшее к NPC', () => {
        const places = createPlacesWithBeggingSpot();
        const state = new NpcStateBuilder().withPosition(1, 2, 3).build();

        plan(createBegTask(places), state);

        expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
          {
            x: 1,
            y: 2,
            z: 3,
          },
          PlaceType.BeggingSpot
        );
      });

      it('Идёт к месту, которое вернул places.findNearest', () => {
        const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
        const spot = createPlace({
          type: PlaceType.BeggingSpot,
          position: {
            x: 50,
            y: 0,
            z: 0,
          },
        });
        const task = createBegTask(
          createPlacesWithBeggingSpot(spot),
          createNpcTaskFactory({ goToCoords })
        );

        plan(task, NpcStateBuilder.default());

        expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
          coords: {
            x: 50,
            y: 0,
            z: 0,
          },
          completeRadius: 0.5,
        });
      });

      it('Поворачивается на угол места, которое вернул places.findNearest', () => {
        const achieveAngle = vi.fn(() => createStubNpcTask('achieve-angle'));
        const spot = createPlace({
          type: PlaceType.BeggingSpot,
          angle: 90,
        });
        const task = createBegTask(
          createPlacesWithBeggingSpot(spot),
          createNpcTaskFactory({ achieveAngle })
        );

        plan(task, NpcStateBuilder.default());

        expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
          angle: 90,
          tolerance: 15,
        });
      });

      it('Пока попрошайничает, сидит с анимацией beg-sitting', () => {
        const playAnimation = vi.fn((options: PlayAnimationTaskOptions) =>
          createNpcTaskFactory().playAnimation(options)
        );
        const task = createBegTask(
          createPlacesWithBeggingSpot(),
          createNpcTaskFactory({ playAnimation })
        );

        plan(task, NpcStateBuilder.default());

        expect(playAnimation).toHaveBeenCalledWith({ animation: 'beg-sitting' });
      });
    });
  });
});
