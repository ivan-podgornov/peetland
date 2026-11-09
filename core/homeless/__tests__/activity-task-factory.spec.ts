import { Geometry } from '@peetland/geometry';
import { createStubPrimitiveTask, createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
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
      const drink = vi.fn(() => createStubTask<NpcState, NpcContext>('drink'));
      const factory = new HomelessActivityTaskFactory(
        createDeps({ homelessTaskFactory: createHomelessTaskFactory({ drink }) })
      );

      factory.create();

      expect(drink).toHaveBeenCalledExactlyOnceWith();
    });

    it('Если homelessTaskFactory не передана, задачи бомжа получают npcTaskFactory из зависимостей', () => {
      const playAnimation = vi.fn(() =>
        createStubPrimitiveTask<NpcState, NpcContext>('play-animation')
      );
      const factory = new HomelessActivityTaskFactory(
        createDeps({ npcTaskFactory: createNpcTaskFactory({ playAnimation }) })
      );

      factory.create();

      expect(playAnimation).toHaveBeenCalled();
    });
  });
});
