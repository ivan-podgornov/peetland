import type { TryLuckTaskOptions } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces, PlaceData } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { Feeling, Trait } from '@peetland/psyche';
import type { IOptimism } from '@peetland/psyche';
import {
  createMockedOptimism,
  createMockedTrait,
  createMockedTraitFactory,
} from '@peetland/psyche/dev';
import type { PsycheBuilder } from '@peetland/psyche/dev';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { BegTask } from '../src/beg-task';
import { BEGGING_CHANCE } from '../src/constants';

/**
 * Создаёт оптимизм, который при шансе BEGGING_CHANCE ожидает attempts попыток до удачи. Если его
 * спросят о другом шансе, выбрасывает Error: клянчанье должно ожидать попыток только при своём шансе
 */
export function createBeggingOptimism(attempts: number): Mocked<IOptimism> {
  const optimism = createMockedOptimism();
  optimism.expectAttempts.mockImplementation((chance) => {
    if (chance !== BEGGING_CHANCE) {
      throw new Error(`Ожидание попыток при шансе ${chance}, а не BEGGING_CHANCE`);
    }

    return attempts;
  });

  return optimism;
}

/**
 * Настраивает билдер психики так, чтобы каждая попытка клянчить меняла стыд на shame, а сколько
 * попыток NPC ожидает до удачи, решал переданный оптимизм. По умолчанию NPC ожидает как реалист:
 * 1 / шанс. Возвращает тот же билдер
 */
export function withBeggingTraits(
  builder: PsycheBuilder,
  shame = 0,
  optimism: IOptimism = createMockedOptimism()
): PsycheBuilder {
  return builder
    .withTraitFactory(
      Trait.Conscientiousness,
      createMockedTraitFactory(createMockedTrait({ [Feeling.Shame]: shame }))
    )
    .withTraitFactory(Trait.Optimism, createMockedTraitFactory(optimism));
}

/** Создаёт задачу клянчанья с настоящей фабрикой примитивов, если другая не передана */
export function createBegTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): BegTask {
  return new BegTask({
    npcTaskFactory,
    places,
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
