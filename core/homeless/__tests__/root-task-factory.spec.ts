import { Geometry } from '@peetland/geometry';
import { createStubPrimitiveTask, createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { HomelessRootTask, HomelessRootTaskFactory } from '../src';
import type { HomelessRootTaskFactoryDeps } from '../src';

import { createHomelessTaskFactory } from './helpers';

/** Создаёт зависимости фабрики корневой задачи бомжа. Свои задачи фабрика собирает по умолчанию */
function createDeps(deps: Partial<HomelessRootTaskFactoryDeps> = {}): HomelessRootTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    places: createMockedPlaces(),
    psycheFactory: createMockedPsycheFactory(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
    ...deps,
  };
}

describe('HomelessRootTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр HomelessRootTask', () => {
      const factory = new HomelessRootTaskFactory(createDeps());

      const task = factory.create();

      expect(task).toBeInstanceOf(HomelessRootTask);
    });

    it('Создаёт задачи бомжа фабрикой homelessTaskFactory из зависимостей', () => {
      const drink = vi.fn(() => createStubTask<NpcState, NpcContext>('drink'));
      const factory = new HomelessRootTaskFactory(
        createDeps({ homelessTaskFactory: createHomelessTaskFactory({ drink }) })
      );

      factory.create();

      expect(drink).toHaveBeenCalledExactlyOnceWith();
    });

    it('Если homelessTaskFactory не передана, задачи бомжа получают npcTaskFactory из зависимостей', () => {
      const playAnimation = vi.fn(() =>
        createStubPrimitiveTask<NpcState, NpcContext>('play-animation')
      );
      const factory = new HomelessRootTaskFactory(
        createDeps({ npcTaskFactory: createNpcTaskFactory({ playAnimation }) })
      );

      factory.create();

      expect(playAnimation).toHaveBeenCalled();
    });
  });
});
