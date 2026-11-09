import type { IGeometry } from '@peetland/geometry';
import { HomelessActivityTaskFactory } from '@peetland/homeless';
import type { Task } from '@peetland/htn';
import { NpcKind } from '@peetland/npc';
import type { IActivityTaskFactory, NpcContext, NpcState } from '@peetland/npc';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import type { ILayerTaskFactory } from './types';

export type ActivityTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи NPC */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /** Фабрика деятельности бомжа. По умолчанию — HomelessActivityTaskFactory */
  homelessActivityTaskFactory?: IActivityTaskFactory;
};

/** Создаёт слой деятельности корневой задачи NPC фабрикой деятельности его типа */
export class ActivityTaskFactory implements ILayerTaskFactory {
  private readonly homelessActivityTaskFactory: IActivityTaskFactory;

  constructor(deps: ActivityTaskFactoryDeps) {
    const {
      geometry,
      places,
      random,
      timer,
      homelessActivityTaskFactory = new HomelessActivityTaskFactory({
        geometry,
        places,
        random,
        timer,
      }),
    } = deps;

    this.homelessActivityTaskFactory = homelessActivityTaskFactory;
  }

  create(kind: NpcKind): Task<NpcState, NpcContext> {
    const { homelessActivityTaskFactory } = this;

    switch (kind) {
      case NpcKind.Homeless:
        return homelessActivityTaskFactory.create();
    }
  }
}
