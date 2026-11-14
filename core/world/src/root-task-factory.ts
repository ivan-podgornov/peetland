import type { IGeometry } from '@peetland/geometry';
import { SatisfyNeedsTaskFactory } from '@peetland/needs-tasks';
import type { ISatisfyNeedsTaskFactory } from '@peetland/needs-tasks';
import type { IRootTaskFactory, NpcKind } from '@peetland/npc';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { ActivityTaskFactory } from './activity-task-factory';
import { AddictionsTaskFactory } from './addictions-task-factory';
import { HobbiesTaskFactory } from './hobbies-task-factory';
import { RootTask } from './root-task';
import type { ILayerTaskFactory } from './types';

export type RootTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи NPC */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /**
   * Фабрика задач удовлетворения потребностей, которой создаётся слой потребностей. По умолчанию —
   * SatisfyNeedsTaskFactory
   */
  satisfyNeedsTaskFactory?: ISatisfyNeedsTaskFactory;
  /** Фабрика слоя зависимостей. По умолчанию — AddictionsTaskFactory */
  addictionsTaskFactory?: ILayerTaskFactory;
  /** Фабрика слоя деятельности. По умолчанию — ActivityTaskFactory */
  activityTaskFactory?: ILayerTaskFactory;
  /** Фабрика слоя хобби. По умолчанию — HobbiesTaskFactory */
  hobbiesTaskFactory?: ILayerTaskFactory;
};

/** Создаёт корневую задачу NPC (см. RootTask) из слоёв, которые создают фабрики слоёв */
export class RootTaskFactory implements IRootTaskFactory {
  private readonly satisfyNeedsTaskFactory: ISatisfyNeedsTaskFactory;
  private readonly addictionsTaskFactory: ILayerTaskFactory;
  private readonly activityTaskFactory: ILayerTaskFactory;
  private readonly hobbiesTaskFactory: ILayerTaskFactory;

  constructor(deps: RootTaskFactoryDeps) {
    const {
      geometry,
      places,
      random,
      timer,
      satisfyNeedsTaskFactory = new SatisfyNeedsTaskFactory(),
      addictionsTaskFactory = new AddictionsTaskFactory(),
      activityTaskFactory = new ActivityTaskFactory({
        geometry,
        places,
        random,
        timer,
      }),
      hobbiesTaskFactory = new HobbiesTaskFactory(),
    } = deps;

    this.satisfyNeedsTaskFactory = satisfyNeedsTaskFactory;
    this.addictionsTaskFactory = addictionsTaskFactory;
    this.activityTaskFactory = activityTaskFactory;
    this.hobbiesTaskFactory = hobbiesTaskFactory;
  }

  create(kind: NpcKind): RootTask {
    const {
      satisfyNeedsTaskFactory,
      addictionsTaskFactory,
      activityTaskFactory,
      hobbiesTaskFactory,
    } = this;

    return new RootTask({
      // Задачи удовлетворения потребностей одинаковые для всех типов NPC
      needs: satisfyNeedsTaskFactory.satisfyNeeds(),
      addictions: addictionsTaskFactory.create(kind),
      activity: activityTaskFactory.create(kind),
      hobbies: hobbiesTaskFactory.create(kind),
    });
  }
}
