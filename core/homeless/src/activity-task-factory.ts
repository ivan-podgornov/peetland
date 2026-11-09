import type { IGeometry } from '@peetland/geometry';
import type { IActivityTaskFactory } from '@peetland/npc';
import { NpcTaskFactory } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { HomelessActivityTask } from './activity-task';
import { HomelessTaskFactory } from './factory';
import type { IHomelessTaskFactory } from './types';

export type HomelessActivityTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи бомжа */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /** Фабрика примитивов, которую получают задачи бомжа. По умолчанию — NpcTaskFactory */
  npcTaskFactory?: INpcTaskFactory;
  /** Фабрика задач бомжа, которую получает деятельность бомжа. По умолчанию — HomelessTaskFactory */
  homelessTaskFactory?: IHomelessTaskFactory;
};

/**
 * Создаёт деятельность бомжа (см. HomelessActivityTask). Задачи бомжа собирает сама, а снаружи
 * получает только то, что общее для всего мира
 */
export class HomelessActivityTaskFactory implements IActivityTaskFactory {
  private readonly homelessTaskFactory: IHomelessTaskFactory;

  constructor(deps: HomelessActivityTaskFactoryDeps) {
    const {
      geometry,
      places,
      random,
      timer,
      npcTaskFactory = new NpcTaskFactory({
        geometry,
        random,
        timer,
      }),
      homelessTaskFactory = new HomelessTaskFactory({
        npcTaskFactory,
        places,
        random,
      }),
    } = deps;

    this.homelessTaskFactory = homelessTaskFactory;
  }

  create(): HomelessActivityTask {
    const { homelessTaskFactory } = this;

    return new HomelessActivityTask({ homelessTaskFactory });
  }
}
