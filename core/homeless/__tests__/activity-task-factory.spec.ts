import { Geometry } from '@peetland/geometry';
import { createStubPrimitiveTask, createStubTask, planSteps } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces, createPlace, createPlaces } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createHomelessTaskFactory } from '../dev';
import { HomelessActivityTask, HomelessActivityTaskFactory } from '../src';
import type { HomelessActivityTaskFactoryDeps } from '../src';

/** Создаёт зависимости фабрики деятельности бомжа. Свои задачи фабрика собирает по умолчанию */
function createDeps(
  deps: Partial<HomelessActivityTaskFactoryDeps> = {}
): HomelessActivityTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    places: createMockedPlaces(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
    ...deps,
  };
}

describe('HomelessActivityTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр HomelessActivityTask', () => {
      const factory = new HomelessActivityTaskFactory(createDeps());

      const task = factory.create();

      expect(task).toBeInstanceOf(HomelessActivityTask);
    });

    it('Создаёт задачи бомжа фабрикой homelessTaskFactory из зависимостей', () => {
      const sellBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('sell-bottles'));
      const factory = new HomelessActivityTaskFactory(
        createDeps({ homelessTaskFactory: createHomelessTaskFactory({ sellBottles }) })
      );

      factory.create();

      expect(sellBottles).toHaveBeenCalledExactlyOnceWith();
    });

    it('Если homelessTaskFactory не передана, задачи бомжа получают npcTaskFactory из зависимостей', () => {
      const goToCoords = vi.fn(() => createStubPrimitiveTask<NpcState, NpcContext>('go-to-coords'));
      const factory = new HomelessActivityTaskFactory(
        createDeps({
          places: createPlaces([createPlace({ type: PlaceType.TrashBin })]),
          npcTaskFactory: createNpcTaskFactory({ goToCoords }),
        })
      );

      // Бутылок и денег нет, попрошайничать негде: бомж идёт собирать бутылки
      planSteps(factory.create(), NpcStateBuilder.default());

      expect(goToCoords).toHaveBeenCalled();
    });
  });
});
