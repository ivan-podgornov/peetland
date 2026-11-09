import { Geometry } from '@peetland/geometry';
import { HomelessActivityTask } from '@peetland/homeless';
import type { Task } from '@peetland/htn';
import { NpcKind } from '@peetland/npc';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { ActivityTaskFactory } from '../src/activity-task-factory';
import type { ActivityTaskFactoryDeps } from '../src/activity-task-factory';

/** Создаёт зависимости фабрики деятельности. Фабрики деятельности типов NPC — по умолчанию */
function createDeps(deps: Partial<ActivityTaskFactoryDeps> = {}): ActivityTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    places: createMockedPlaces(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
    ...deps,
  };
}

describe('ActivityTaskFactory', () => {
  describe('#create', () => {
    it('Для бомжа вызывает create у homelessActivityTaskFactory', () => {
      const homelessActivityTaskFactory = {
        create: vi.fn(() => ({
          name: 'activity',
          methods: [],
        })),
      };
      const factory = new ActivityTaskFactory(createDeps({ homelessActivityTaskFactory }));

      factory.create(NpcKind.Homeless);

      expect(homelessActivityTaskFactory.create).toHaveBeenCalledExactlyOnceWith();
    });

    it('Для бомжа возвращает задачу, которую вернула homelessActivityTaskFactory', () => {
      const activityTask: Task<NpcState, NpcContext> = {
        name: 'activity',
        methods: [],
      };
      const factory = new ActivityTaskFactory(
        createDeps({ homelessActivityTaskFactory: { create: () => activityTask } })
      );

      const task = factory.create(NpcKind.Homeless);

      expect(task).toBe(activityTask);
    });

    it('Если homelessActivityTaskFactory не передана, для бомжа возвращает экземпляр HomelessActivityTask', () => {
      const factory = new ActivityTaskFactory(createDeps());

      const task = factory.create(NpcKind.Homeless);

      expect(task).toBeInstanceOf(HomelessActivityTask);
    });
  });
});
