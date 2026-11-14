import { Geometry } from '@peetland/geometry';
import { HomelessActivityTask } from '@peetland/homeless';
import { createStubTask, methodTasks } from '@peetland/htn/dev';
import { SatisfyNeedsTask } from '@peetland/needs-tasks';
import { createMockedSatisfyNeedsTaskFactory } from '@peetland/needs-tasks/dev';
import { NpcKind } from '@peetland/npc';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { RootTask } from '../src/root-task';
import { RootTaskFactory } from '../src/root-task-factory';
import type { RootTaskFactoryDeps } from '../src/root-task-factory';

/** Создаёт зависимости фабрики корневых задач. Фабрики слоёв — по умолчанию */
function createDeps(deps: Partial<RootTaskFactoryDeps> = {}): RootTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    places: createMockedPlaces(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
    ...deps,
  };
}

/** Создаёт фабрику слоя, которая возвращает задачу с переданным именем */
function createLayerTaskFactory(name: string) {
  return { create: vi.fn(() => createStubTask<NpcState, NpcContext>(name)) };
}

describe('RootTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр RootTask', () => {
      const factory = new RootTaskFactory(createDeps());

      const task = factory.create(NpcKind.Homeless);

      expect(task).toBeInstanceOf(RootTask);
    });

    it('Создаёт слой потребностей фабрикой satisfyNeedsTaskFactory', () => {
      const satisfyNeedsTaskFactory = createMockedSatisfyNeedsTaskFactory();
      const factory = new RootTaskFactory(createDeps({ satisfyNeedsTaskFactory }));

      factory.create(NpcKind.Homeless);

      expect(satisfyNeedsTaskFactory.satisfyNeeds).toHaveBeenCalledOnce();
    });

    it('Создаёт слой зависимостей фабрикой addictionsTaskFactory с типом NPC', () => {
      const addictionsTaskFactory = createLayerTaskFactory('addictions');
      const factory = new RootTaskFactory(createDeps({ addictionsTaskFactory }));

      factory.create(NpcKind.Homeless);

      expect(addictionsTaskFactory.create).toHaveBeenCalledExactlyOnceWith(NpcKind.Homeless);
    });

    it('Создаёт слой деятельности фабрикой activityTaskFactory с типом NPC', () => {
      const activityTaskFactory = createLayerTaskFactory('activity');
      const factory = new RootTaskFactory(createDeps({ activityTaskFactory }));

      factory.create(NpcKind.Homeless);

      expect(activityTaskFactory.create).toHaveBeenCalledExactlyOnceWith(NpcKind.Homeless);
    });

    it('Создаёт слой хобби фабрикой hobbiesTaskFactory с типом NPC', () => {
      const hobbiesTaskFactory = createLayerTaskFactory('hobbies');
      const factory = new RootTaskFactory(createDeps({ hobbiesTaskFactory }));

      factory.create(NpcKind.Homeless);

      expect(hobbiesTaskFactory.create).toHaveBeenCalledExactlyOnceWith(NpcKind.Homeless);
    });

    it('Если activityTaskFactory не передана, слой деятельности бомжа — экземпляр HomelessActivityTask', () => {
      const factory = new RootTaskFactory(createDeps());

      const task = factory.create(NpcKind.Homeless);

      expect(methodTasks(task, 'activity')).toStrictEqual([expect.any(HomelessActivityTask)]);
    });

    it('Если satisfyNeedsTaskFactory не передана, слой потребностей — экземпляр SatisfyNeedsTask', () => {
      const factory = new RootTaskFactory(createDeps());

      const task = factory.create(NpcKind.Homeless);

      expect(methodTasks(task, 'needs')).toStrictEqual([expect.any(SatisfyNeedsTask)]);
    });
  });
});
