import { Addiction } from '@peetland/addictions';
import { AddictionsTask } from '@peetland/addictions-tasks';
import { createMockedAddictionsTaskFactory } from '@peetland/addictions-tasks/dev';
import { Geometry } from '@peetland/geometry';
import { HomelessActivityTask } from '@peetland/homeless';
import { createStubTask, methodTasks, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import { NeedsTask } from '@peetland/needs-tasks';
import { createMockedNeedsTaskFactory } from '@peetland/needs-tasks/dev';
import { NpcKind } from '@peetland/npc';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { PlaceType } from '@peetland/places';
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

    it('Создаёт слой потребностей фабрикой needsTaskFactory', () => {
      const needsTaskFactory = createMockedNeedsTaskFactory();
      const factory = new RootTaskFactory(createDeps({ needsTaskFactory }));

      factory.create(NpcKind.Homeless);

      expect(needsTaskFactory.satisfyNeeds).toHaveBeenCalledOnce();
    });

    it('Создаёт слой зависимостей фабрикой addictionsTaskFactory', () => {
      const addictionsTaskFactory = createMockedAddictionsTaskFactory();
      const factory = new RootTaskFactory(createDeps({ addictionsTaskFactory }));

      factory.create(NpcKind.Homeless);

      expect(addictionsTaskFactory.satisfyAddictions).toHaveBeenCalledOnce();
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

    it('Если needsTaskFactory не передана, слой потребностей — экземпляр NeedsTask', () => {
      const factory = new RootTaskFactory(createDeps());

      const task = factory.create(NpcKind.Homeless);

      expect(methodTasks(task, 'needs')).toStrictEqual([expect.any(NeedsTask)]);
    });

    it('Если needsTaskFactory не передана, задачи потребностей получают места из зависимостей', () => {
      const places = createMockedPlaces();
      const factory = new RootTaskFactory(createDeps({ places }));
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: 1000 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.create(NpcKind.Homeless), state);

      expect(places.ofType).toHaveBeenCalledWith(PlaceType.Shop);
    });

    it('Если addictionsTaskFactory не передана, слой зависимостей — экземпляр AddictionsTask', () => {
      const factory = new RootTaskFactory(createDeps());

      const task = factory.create(NpcKind.Homeless);

      expect(methodTasks(task, 'addictions')).toStrictEqual([expect.any(AddictionsTask)]);
    });

    it('Если addictionsTaskFactory не передана, задачи зависимостей получают места из зависимостей', () => {
      const places = createMockedPlaces();
      const factory = new RootTaskFactory(createDeps({ places }));
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Booze]: 1 })
        .withAddictions((addictions) =>
          addictions
            .withStrength(Addiction.Alcoholism, 100)
            .withSatisfaction(Addiction.Alcoholism, 0)
            .build()
        )
        .build();

      planSteps(factory.create(NpcKind.Homeless), state);

      expect(places.ofType).toHaveBeenCalledWith(PlaceType.DrinkingSpot);
    });
  });
});
