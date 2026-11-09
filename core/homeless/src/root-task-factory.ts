import type { IGeometry } from '@peetland/geometry';
import type { IKindRootTaskFactory } from '@peetland/npc';
import { NpcTaskFactory } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { HomelessTaskFactory } from './factory';
import { HomelessRootTask } from './root-task';
import type { IHomelessTaskFactory } from './types';

export type HomelessRootTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи бомжа */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /** Фабрика примитивов, которую получают задачи бомжа. По умолчанию — NpcTaskFactory */
  npcTaskFactory?: INpcTaskFactory;
  /** Фабрика задач бомжа, которую получает корневая задача. По умолчанию — HomelessTaskFactory */
  homelessTaskFactory?: IHomelessTaskFactory;
};

/**
 * Создаёт корневые задачи бомжа (см. HomelessRootTask). Задачи бомжа собирает сама, а снаружи
 * получает только то, что общее для всего мира
 */
export class HomelessRootTaskFactory implements IKindRootTaskFactory {
  private readonly homelessTaskFactory: IHomelessTaskFactory;

  constructor(deps: HomelessRootTaskFactoryDeps) {
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

  create(): HomelessRootTask {
    const { homelessTaskFactory } = this;

    return new HomelessRootTask({ homelessTaskFactory });
  }
}
