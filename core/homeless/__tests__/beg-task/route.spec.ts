import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { PlayAnimationTaskOptions } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import {
  createBegTask,
  createPlacesWithBeggingSpot,
  createTaskFactoryWithTryLuckSpy,
} from '../../dev';
import { BEGGING_CHANCE, BEGGING_REWARD } from '../../src/beg-task';
import { BOOZE_PRICE } from '../../src/buy-booze-task';

describe('BegTask', () => {
  it('Планирует дойти до места, повернуться и клянчить', () => {
    const task = createBegTask(createPlacesWithBeggingSpot());
    const state = new NpcStateBuilder()
      .withInventory({ [Item.Money]: BOOZE_PRICE - BEGGING_REWARD })
      .build();

    expect(planNames(task, state)).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'parallel',
      'add-item',
    ]);
  });

  it('Ищет место для клянчанья, ближайшее к NPC', () => {
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
    const goToCoords = vi.fn();
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
    const achieveAngle = vi.fn();
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

  it('Клянчит с шансом BEGGING_CHANCE', () => {
    const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();

    plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), NpcStateBuilder.default());

    expect(tryLuck).toHaveBeenCalledWith(expect.objectContaining({ chance: BEGGING_CHANCE }));
  });

  it('Пока клянчит, сидит с анимацией beg-sitting', () => {
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

  it('Если мест для клянчанья нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    expect(planNames(createBegTask(places), NpcStateBuilder.default())).toBeNull();
  });
});
