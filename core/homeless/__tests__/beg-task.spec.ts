import { applyPlanEffects, plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createNpcContext, createNpcState } from '@peetland/npc/dev';
import type { PlayAnimationTaskOptions, TryLuckTaskOptions } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces, PlaceData } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
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

import { BEGGING_CHANCE, BEGGING_REWARD, BEGGING_SHAME_LIMIT, BegTask } from '../src/beg-task';
import { BOOZE_PRICE } from '../src/buy-booze-task';
import { BOTTLE_PRICE } from '../src/sell-bottles-task';

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

/** Создаёт задачу клянчанья с настоящей фабрикой примитивов, если другая не передана */
function createTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory(),
  psycheFactory: IPsycheFactory = createPsycheFactory()
): BegTask {
  return new BegTask({
    npcTaskFactory,
    places,
    psycheFactory,
  });
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
    self: {
      psyche: createPsycheState({
        feelings: { [Feeling.Shame]: shame },
      }),
    },
  });
}

/** Создаёт фабрику задач, которая запоминает параметры каждой попытки удачи */
function createTaskFactoryWithTryLuckSpy() {
  const tryLuck = vi.fn((options: TryLuckTaskOptions) => createNpcTaskFactory().tryLuck(options));

  return {
    tryLuck,
    npcTaskFactory: createNpcTaskFactory({ tryLuck }),
  };
}

describe('BegTask', () => {
  it('Планирует дойти до места, повернуться и клянчить', () => {
    const task = createTask(createPlacesWithSpot());
    const state = createNpcState({
      self: { inventory: { [Item.Money]: BOOZE_PRICE - BEGGING_REWARD } },
    });

    expect(planNames(task, state)).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'parallel',
      'add-item',
    ]);
  });

  it('Если ни денег, ни бутылок нет, клянчит на всё пойло', () => {
    const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();

    plan(
      createTask(createPlacesWithSpot(), npcTaskFactory),
      createNpcState({ self: { inventory: {} } })
    );

    expect(tryLuck).toHaveBeenCalledTimes(BOOZE_PRICE / BEGGING_REWARD);
  });

  it('Клянчит столько, сколько не хватает на пойло вместе с деньгами и выручкой за бутылки', () => {
    const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
    const state = createNpcState({
      self: {
        inventory: {
          [Item.Money]: 3 * BEGGING_REWARD,
          [Item.Bottles]: 2,
        },
      },
    });

    plan(createTask(createPlacesWithSpot(), npcTaskFactory), state);

    expect(tryLuck).toHaveBeenCalledTimes(
      (BOOZE_PRICE - 3 * BEGGING_REWARD - 2 * BOTTLE_PRICE) / BEGGING_REWARD
    );
  });

  it('Если не хватает не кратно BEGGING_REWARD, клянчит с запасом до целой удачи', () => {
    const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
    const state = createNpcState({
      self: { inventory: { [Item.Money]: BOOZE_PRICE - BEGGING_REWARD - 1 } },
    });

    plan(createTask(createPlacesWithSpot(), npcTaskFactory), state);

    expect(tryLuck).toHaveBeenCalledTimes(2);
  });

  it('Если на пойло хватает денег и выручки за бутылки, план не составляется', () => {
    const task = createTask(createPlacesWithSpot());
    const state = createNpcState({
      self: {
        inventory: {
          [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE,
          [Item.Bottles]: 1,
        },
      },
    });

    expect(planNames(task, state)).toBeNull();
  });

  it('Ищет место для клянчанья, ближайшее к NPC', () => {
    const places = createPlacesWithSpot();
    const state = createNpcState({
      self: {
        actor: {
          position: {
            x: 1,
            y: 2,
            z: 3,
          },
          angle: 0,
        },
      },
    });

    plan(createTask(places), state);

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
    const task = createTask(createPlacesWithSpot(spot), createNpcTaskFactory({ goToCoords }));

    plan(task, createNpcState());

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
    const task = createTask(createPlacesWithSpot(spot), createNpcTaskFactory({ achieveAngle }));

    plan(task, createNpcState());

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
      angle: 90,
      tolerance: 15,
    });
  });

  it('Клянчит с шансом BEGGING_CHANCE', () => {
    const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();

    plan(createTask(createPlacesWithSpot(), npcTaskFactory), createNpcState());

    expect(tryLuck).toHaveBeenCalledWith(expect.objectContaining({ chance: BEGGING_CHANCE }));
  });

  it('Пока клянчит, сидит с анимацией beg-sitting', () => {
    const playAnimation = vi.fn((options: PlayAnimationTaskOptions) =>
      createNpcTaskFactory().playAnimation(options)
    );
    const task = createTask(createPlacesWithSpot(), createNpcTaskFactory({ playAnimation }));

    plan(task, createNpcState());

    expect(playAnimation).toHaveBeenCalledWith({ animation: 'beg-sitting' });
  });

  it('За каждую удачу получает BEGGING_REWARD', () => {
    const task = createTask(createPlacesWithSpot());
    const state = createNpcState({
      self: { inventory: { [Item.Money]: BOOZE_PRICE - 2 * BEGGING_REWARD } },
    });

    const after = applyPlanEffects(task, state);

    expect(after.self.inventory).toStrictEqual({ [Item.Money]: BOOZE_PRICE });
  });

  describe('При 20 стыда за удачу, когда до BEGGING_SHAME_LIMIT успевают 3 удачи', () => {
    // 40 попыток на удачу по 0.5 стыда: перед удачами стыд 0, 20, 40, а перед четвёртой — уже 60

    it('Если нужно 3 удачи, планирует клянчить', () => {
      const task = createTask(
        createPlacesWithSpot(),
        createNpcTaskFactory(),
        createPsycheFactory(0.5)
      );
      const state = createNpcState({
        self: {
          inventory: { [Item.Money]: BOOZE_PRICE - 3 * BEGGING_REWARD },
        },
      });

      expect(planNames(task, state)).not.toBeNull();
    });

    it('Если нужно 4 удачи, план не составляется', () => {
      const task = createTask(
        createPlacesWithSpot(),
        createNpcTaskFactory(),
        createPsycheFactory(0.5)
      );
      const state = createNpcState({
        self: {
          inventory: { [Item.Money]: BOOZE_PRICE - 4 * BEGGING_REWARD },
        },
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
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      const psyche = createMockedPsyche();
      plan(createTask(createPlacesWithSpot(), npcTaskFactory), createNpcState());

      tryLuck.mock.calls[0]?.[0].onAttempt?.({
        ...createNpcContext(),
        psyche,
      });

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.Begging);
    });

    it('Если стыд достиг BEGGING_SHAME_LIMIT, останавливает клянчанье', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createTask(createPlacesWithSpot(), npcTaskFactory), createNpcState());

      const stop = tryLuck.mock.calls[0]?.[0].stopWhen?.(createStateWithShame(BEGGING_SHAME_LIMIT));

      expect(stop).toBe(true);
    });

    it('Если стыд ниже BEGGING_SHAME_LIMIT, не останавливает клянчанье', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createTask(createPlacesWithSpot(), npcTaskFactory), createNpcState());

      const stop = tryLuck.mock.calls[0]?.[0].stopWhen?.(
        createStateWithShame(BEGGING_SHAME_LIMIT - 1)
      );

      expect(stop).toBe(false);
    });

    it('Предсказывает стыд так, будто на удачу ушло EXPECTED_BEGGING_ATTEMPTS попыток', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(
        createTask(createPlacesWithSpot(), npcTaskFactory, createPsycheFactory(0.5)),
        createNpcState({ self: { inventory: { [Item.Money]: BOOZE_PRICE - BEGGING_REWARD } } })
      );

      const after = tryLuck.mock.calls[0]?.[0].applyEffects?.(createStateWithShame(10));

      // 10 + 40 попыток по 0.5
      expect(after?.self.psyche.feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });

    it('Предсказание стыда не меняет то, что NPC знает о мире', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createTask(createPlacesWithSpot(), npcTaskFactory), createNpcState());

      const after = tryLuck.mock.calls[0]?.[0].applyEffects?.(
        createNpcState({ world: { time: 20 * 60 } })
      );

      expect(after?.world).toStrictEqual({ time: 20 * 60 });
    });
  });
});
