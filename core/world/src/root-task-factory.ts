import type { IGeometry } from '@peetland/geometry';
import type { IRootTaskFactory, NpcKind } from '@peetland/npc';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { ActivityTaskFactory } from './activity-task-factory';
import { AddictionsTaskFactory } from './addictions-task-factory';
import { HobbiesTaskFactory } from './hobbies-task-factory';
import { NeedsTaskFactory } from './needs-task-factory';
import { RootTask } from './root-task';
import type { ILayerTaskFactory } from './types';

export type RootTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи NPC */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /** Фабрика слоя потребностей. По умолчанию — NeedsTaskFactory */
  needsTaskFactory?: ILayerTaskFactory;
  /** Фабрика слоя зависимостей. По умолчанию — AddictionsTaskFactory */
  addictionsTaskFactory?: ILayerTaskFactory;
  /** Фабрика слоя хобби. По умолчанию — HobbiesTaskFactory */
  hobbiesTaskFactory?: ILayerTaskFactory;
  /** Фабрика слоя деятельности. По умолчанию — ActivityTaskFactory */
  activityTaskFactory?: ILayerTaskFactory;
};

/** Создаёт корневую задачу NPC (см. RootTask) из слоёв, которые создают фабрики слоёв */
export class RootTaskFactory implements IRootTaskFactory {
  private readonly needsTaskFactory: ILayerTaskFactory;
  private readonly addictionsTaskFactory: ILayerTaskFactory;
  private readonly hobbiesTaskFactory: ILayerTaskFactory;
  private readonly activityTaskFactory: ILayerTaskFactory;

  constructor(deps: RootTaskFactoryDeps) {
    const {
      geometry,
      places,
      random,
      timer,
      needsTaskFactory = new NeedsTaskFactory(),
      addictionsTaskFactory = new AddictionsTaskFactory(),
      hobbiesTaskFactory = new HobbiesTaskFactory(),
      activityTaskFactory = new ActivityTaskFactory({
        geometry,
        places,
        random,
        timer,
      }),
    } = deps;

    this.needsTaskFactory = needsTaskFactory;
    this.addictionsTaskFactory = addictionsTaskFactory;
    this.hobbiesTaskFactory = hobbiesTaskFactory;
    this.activityTaskFactory = activityTaskFactory;
  }

  create(kind: NpcKind): RootTask {
    const { needsTaskFactory, addictionsTaskFactory, hobbiesTaskFactory, activityTaskFactory } =
      this;

    return new RootTask({
      needs: needsTaskFactory.create(kind),
      addictions: addictionsTaskFactory.create(kind),
      hobbies: hobbiesTaskFactory.create(kind),
      activity: activityTaskFactory.create(kind),
    });
  }
}
