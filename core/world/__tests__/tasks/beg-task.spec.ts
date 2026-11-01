import { Item } from '@peetland/inventory';
import { Deed, Feeling, PsycheFactory, Trait } from '@peetland/psyche';
import type { IPsycheFactory } from '@peetland/psyche';
import {
  createMockedPsyche,
  createMockedTrait,
  createMockedTraitFactory,
  createPsycheDeps,
  createPsycheState,
} from '@peetland/psyche/dev';
import { describe, expect, it, vi } from 'vitest';

import {
  BEGGING_CHANCE,
  BEGGING_REWARD,
  BEGGING_SHAME_LIMIT,
  BegTask,
  BOOZE_PRICE,
  BOTTLE_PRICE,
  PlaceType,
} from '../../src';
import type {
  IPlaces,
  ITaskFactory,
  PlaceData,
  PlayAnimationTaskOptions,
  TryLuckTaskOptions,
} from '../../src';
import { createMockedPlaces } from '../places/helpers';

import {
  applyPlanEffects,
  createNpcContext,
  createNpcState,
  createPlace,
  createTaskFactory,
  plan,
  planNames,
} from './helpers';

/** Создаёт фабрику психики, у которой каждая попытка клянчить меняет стыд на shame */
function createPsycheFactory(shame = 0): IPsycheFactory {
  return new PsycheFactory(
    createPsycheDeps({
      [Trait.Conscientiousness]: createMockedTraitFactory(
        createMockedTrait({ [Feeling.Shame]: shame })
      ),
    })
  );
}

/** Создаёт задачу клянчанья с настоящей фабрикой задач, если другая не передана */
function createTask(
  places: IPlaces,
  taskFactory: ITaskFactory = createTaskFactory(),
  psycheFactory: IPsycheFactory = createPsycheFactory()
): BegTask {
  return new BegTask({ places }, { taskFactory, psycheFactory });
}

/** Создаёт мок мест, в которых ближайшее место для клянчанья — переданное */
function createPlacesWithSpot(spot: PlaceData = createPlace({ type: PlaceType.BeggingSpot })) {
  return createMockedPlaces({
    ofType: vi.fn(() => [spot]),
    findNearest: vi.fn(() => spot),
  });
}

/** Создаёт состояние NPC с переданным стыдом */
function createStateWithShame(shame: number) {
  return createNpcState({
    psyche: createPsycheState({
      feelings: { [Feeling.Shame]: shame },
    }),
  });
}

/** Создаёт фабрику задач, которая запоминает параметры каждой попытки удачи */
function createTaskFactoryWithTryLuckSpy() {
  const tryLuck = vi.fn((options: TryLuckTaskOptions) => createTaskFactory().tryLuck(options));

  return { tryLuck, taskFactory: createTaskFactory({ tryLuck }) };
}

describe('BegTask', () => {
  it('Планирует дойти до места, повернуться и клянчить', () => {
    const task = createTask(createPlacesWithSpot());
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - BEGGING_REWARD } });

    expect(planNames(task, state)).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'parallel',
      'add-item',
    ]);
  });

  it('Если ни денег, ни бутылок нет, клянчит на всё пойло', () => {
    const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();

    plan(createTask(createPlacesWithSpot(), taskFactory), createNpcState({ inventory: {} }));

    expect(tryLuck).toHaveBeenCalledTimes(BOOZE_PRICE / BEGGING_REWARD);
  });

  it('Клянчит столько, сколько не хватает на пойло вместе с деньгами и выручкой за бутылки', () => {
    const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();
    const state = createNpcState({
      inventory: {
        [Item.Money]: 3 * BEGGING_REWARD,
        [Item.Bottles]: 2,
      },
    });

    plan(createTask(createPlacesWithSpot(), taskFactory), state);

    expect(tryLuck).toHaveBeenCalledTimes(
      (BOOZE_PRICE - 3 * BEGGING_REWARD - 2 * BOTTLE_PRICE) / BEGGING_REWARD
    );
  });

  it('Если не хватает не кратно BEGGING_REWARD, клянчит с запасом до целой удачи', () => {
    const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - BEGGING_REWARD - 1 } });

    plan(createTask(createPlacesWithSpot(), taskFactory), state);

    expect(tryLuck).toHaveBeenCalledTimes(2);
  });

  it('Если на пойло хватает денег и выручки за бутылки, план не составляется', () => {
    const task = createTask(createPlacesWithSpot());
    const state = createNpcState({
      inventory: {
        [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE,
        [Item.Bottles]: 1,
      },
    });

    expect(planNames(task, state)).toBeNull();
  });

  it('Ищет место для клянчанья, ближайшее к NPC', () => {
    const places = createPlacesWithSpot();
    const state = createNpcState({ actor: { position: { x: 1, y: 2, z: 3 }, angle: 0 } });

    plan(createTask(places), state);

    expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
      { x: 1, y: 2, z: 3 },
      PlaceType.BeggingSpot
    );
  });

  it('Идёт к месту, которое вернул places.findNearest', () => {
    const goToCoords = vi.fn();
    const spot = createPlace({ type: PlaceType.BeggingSpot, position: { x: 50, y: 0, z: 0 } });
    const task = createTask(createPlacesWithSpot(spot), createTaskFactory({ goToCoords }));

    plan(task, createNpcState());

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: { x: 50, y: 0, z: 0 },
      completeRadius: 0.5,
    });
  });

  it('Поворачивается на угол места, которое вернул places.findNearest', () => {
    const achieveAngle = vi.fn();
    const spot = createPlace({ type: PlaceType.BeggingSpot, angle: 90 });
    const task = createTask(createPlacesWithSpot(spot), createTaskFactory({ achieveAngle }));

    plan(task, createNpcState());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({ angle: 90, tolerance: 15 });
  });

  it('Клянчит с шансом BEGGING_CHANCE', () => {
    const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();

    plan(createTask(createPlacesWithSpot(), taskFactory), createNpcState());

    expect(tryLuck).toHaveBeenCalledWith(expect.objectContaining({ chance: BEGGING_CHANCE }));
  });

  it('Пока клянчит, сидит с анимацией beg-sitting', () => {
    const playAnimation = vi.fn((options: PlayAnimationTaskOptions) =>
      createTaskFactory().playAnimation(options)
    );
    const task = createTask(createPlacesWithSpot(), createTaskFactory({ playAnimation }));

    plan(task, createNpcState());

    expect(playAnimation).toHaveBeenCalledWith({ animation: 'beg-sitting' });
  });

  it('За каждую удачу получает BEGGING_REWARD', () => {
    const task = createTask(createPlacesWithSpot());
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - 2 * BEGGING_REWARD } });

    const after = applyPlanEffects(task, state);

    expect(after.inventory).toStrictEqual({ [Item.Money]: BOOZE_PRICE });
  });

  describe('При 20 стыда за удачу, когда до BEGGING_SHAME_LIMIT успевают 3 удачи', () => {
    // 40 попыток на удачу по 0.5 стыда: перед удачами стыд 0, 20, 40, а перед четвёртой — уже 60

    it('Если нужно 3 удачи, планирует клянчить', () => {
      const task = createTask(
        createPlacesWithSpot(),
        createTaskFactory(),
        createPsycheFactory(0.5)
      );
      const state = createNpcState({
        inventory: { [Item.Money]: BOOZE_PRICE - 3 * BEGGING_REWARD },
      });

      expect(planNames(task, state)).not.toBeNull();
    });

    it('Если нужно 4 удачи, план не составляется', () => {
      const task = createTask(
        createPlacesWithSpot(),
        createTaskFactory(),
        createPsycheFactory(0.5)
      );
      const state = createNpcState({
        inventory: { [Item.Money]: BOOZE_PRICE - 4 * BEGGING_REWARD },
      });

      expect(planNames(task, state)).toBeNull();
    });
  });

  it('Если стыд достиг BEGGING_SHAME_LIMIT, план не составляется', () => {
    const task = createTask(createPlacesWithSpot());

    expect(planNames(task, createStateWithShame(BEGGING_SHAME_LIMIT))).toBeNull();
  });

  it('Если мест для клянчанья нет, план не составляется', () => {
    const places = createMockedPlaces({ ofType: vi.fn(() => []) });

    expect(planNames(createTask(places), createNpcState())).toBeNull();
  });

  describe('Каждая попытка', () => {
    it('Сообщает психике NPC о поступке Deed.Begging', () => {
      const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();
      const psyche = createMockedPsyche();
      plan(createTask(createPlacesWithSpot(), taskFactory), createNpcState());

      tryLuck.mock.calls[0]?.[0].onAttempt?.({ ...createNpcContext(), psyche });

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.Begging);
    });

    it('Если стыд достиг BEGGING_SHAME_LIMIT, останавливает клянчанье', () => {
      const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createTask(createPlacesWithSpot(), taskFactory), createNpcState());

      const stop = tryLuck.mock.calls[0]?.[0].stopWhen?.(createStateWithShame(BEGGING_SHAME_LIMIT));

      expect(stop).toBe(true);
    });

    it('Если стыд ниже BEGGING_SHAME_LIMIT, не останавливает клянчанье', () => {
      const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createTask(createPlacesWithSpot(), taskFactory), createNpcState());

      const stop = tryLuck.mock.calls[0]?.[0].stopWhen?.(
        createStateWithShame(BEGGING_SHAME_LIMIT - 1)
      );

      expect(stop).toBe(false);
    });

    it('Предсказывает стыд так, будто на удачу ушло EXPECTED_BEGGING_ATTEMPTS попыток', () => {
      const { tryLuck, taskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(
        createTask(createPlacesWithSpot(), taskFactory, createPsycheFactory(0.5)),
        createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - BEGGING_REWARD } })
      );

      const after = tryLuck.mock.calls[0]?.[0].applyEffects?.(createStateWithShame(10));

      // 10 + 40 попыток по 0.5
      expect(after?.psyche.feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });
  });
});
