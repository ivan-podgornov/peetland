import type { TryLuckTaskOptions } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces, PlaceData } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { Feeling, PsycheFactory, Trait } from '@peetland/psyche';
import type { IPsycheFactory } from '@peetland/psyche';
import {
  createMockedTrait,
  createMockedTraitFactory,
  createPsycheDeps,
} from '@peetland/psyche/dev';
import { vi } from 'vitest';

import { BegTask } from '../src/beg-task';

/** Создаёт фабрику психики, у которой каждая попытка клянчить меняет стыд на shame */
export function createBeggingPsycheFactory(shame = 0): IPsycheFactory {
  return new PsycheFactory(
    createPsycheDeps({
      [Trait.Conscientiousness]: createMockedTraitFactory(
        createMockedTrait({ [Feeling.Shame]: shame })
      ),
    })
  );
}

/** Создаёт задачу клянчанья с настоящей фабрикой примитивов, если другая не передана */
export function createBegTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory(),
  psycheFactory: IPsycheFactory = createBeggingPsycheFactory()
): BegTask {
  return new BegTask({
    npcTaskFactory,
    places,
    psycheFactory,
  });
}

/** Создаёт мок мест, в которых ближайшее место для клянчанья — переданное */
export function createPlacesWithBeggingSpot(
  spot: PlaceData = createPlace({ type: PlaceType.BeggingSpot })
) {
  return createMockedPlaces({
    ofType: vi.fn(() => [spot]),
    findNearest: vi.fn(() => spot),
  });
}

/** Создаёт фабрику задач, которая запоминает параметры каждой попытки удачи */
export function createTaskFactoryWithTryLuckSpy() {
  const tryLuck = vi.fn((options: TryLuckTaskOptions) => createNpcTaskFactory().tryLuck(options));

  return {
    tryLuck,
    npcTaskFactory: createNpcTaskFactory({ tryLuck }),
  };
}
