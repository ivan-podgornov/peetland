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
  needsTaskFactory?: ISatisfyNeedsTaskFactory;
  /** Фабрика слоя зависимостей. По умолчанию — AddictionsTaskFactory */
  addictionsTaskFactory?: ILayerTaskFactory;
  /** Фабрика слоя деятельности. По умолчанию — ActivityTaskFactory */
  activityTaskFactory?: ILayerTaskFactory;
  /** Фабрика слоя хобби. По умолчанию — HobbiesTaskFactory */
  hobbiesTaskFactory?: ILayerTaskFactory;
};

/** Создаёт корневую задачу NPC (см. RootTask) из слоёв, которые создают фабрики слоёв */
export class RootTaskFactory implements IRootTaskFactory {
  private readonly needsTaskFactory: ISatisfyNeedsTaskFactory;
  private readonly addictionsTaskFactory: ILayerTaskFactory;
  private readonly activityTaskFactory: ILayerTaskFactory;
  private readonly hobbiesTaskFactory: ILayerTaskFactory;

  constructor(deps: RootTaskFactoryDeps) {
    const {
      geometry,
      places,
      random,
      timer,
      needsTaskFactory = new SatisfyNeedsTaskFactory(),
      addictionsTaskFactory = new AddictionsTaskFactory(),
      activityTaskFactory = new ActivityTaskFactory({
        geometry,
        places,
        random,
        timer,
      }),
      hobbiesTaskFactory = new HobbiesTaskFactory(),
    } = deps;

    this.needsTaskFactory = needsTaskFactory;
    this.addictionsTaskFactory = addictionsTaskFactory;
    this.activityTaskFactory = activityTaskFactory;
    this.hobbiesTaskFactory = hobbiesTaskFactory;
  }

  create(kind: NpcKind): RootTask {
    const { needsTaskFactory, addictionsTaskFactory, activityTaskFactory, hobbiesTaskFactory } =
      this;

    return new RootTask({
      // Задачи удовлетворения потребностей одинаковые для всех типов NPC
      needs: needsTaskFactory.satisfyNeeds(),
      addictions: addictionsTaskFactory.create(kind),
      activity: activityTaskFactory.create(kind),
      hobbies: hobbiesTaskFactory.create(kind),
    });
  }
}
