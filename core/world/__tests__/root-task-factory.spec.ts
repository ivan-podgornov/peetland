import { Geometry } from '@peetland/geometry';
import { HomelessRootTask } from '@peetland/homeless';
import type { Task } from '@peetland/htn';
import { NpcKind } from '@peetland/npc';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { RootTaskFactory } from '../src/root-task-factory';
import type { RootTaskFactoryDeps } from '../src/root-task-factory';

/** Создаёт зависимости фабрики корневых задач. Фабрики типов NPC — по умолчанию */
function createDeps(deps: Partial<RootTaskFactoryDeps> = {}): RootTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    places: createMockedPlaces(),
    psycheFactory: createMockedPsycheFactory(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
    ...deps,
  };
}

describe('RootTaskFactory', () => {
  describe('#create', () => {
    it('Вызывает create у фабрики переданного типа из kindFactories', () => {
      const homelessFactory = {
        create: vi.fn(() => ({
          name: 'root',
          methods: [],
        })),
      };
      const factory = new RootTaskFactory(
        createDeps({ kindFactories: { [NpcKind.Homeless]: homelessFactory } })
      );

      factory.create(NpcKind.Homeless);

      expect(homelessFactory.create).toHaveBeenCalledExactlyOnceWith();
    });

    it('Возвращает задачу, которую вернула фабрика переданного типа', () => {
      const rootTask: Task<NpcState, NpcContext> = {
        name: 'root',
        methods: [],
      };
      const factory = new RootTaskFactory(
        createDeps({ kindFactories: { [NpcKind.Homeless]: { create: () => rootTask } } })
      );

      const task = factory.create(NpcKind.Homeless);

      expect(task).toBe(rootTask);
    });

    it('Если фабрика бомжа не передана, для бомжа возвращает экземпляр HomelessRootTask', () => {
      const factory = new RootTaskFactory(createDeps());

      const task = factory.create(NpcKind.Homeless);

      expect(task).toBeInstanceOf(HomelessRootTask);
    });
  });
});
