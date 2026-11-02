import type { IGeometry } from '@peetland/geometry';
import type { IKindRootTaskFactory } from '@peetland/npc';
import { NpcTaskFactory } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { IPlaces } from '@peetland/places';
import type { IPsycheFactory } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { HomelessTaskFactory } from './factory';
import type { IHomelessTaskFactory } from './factory';
import { HomelessRootTask } from './root-task';

export type HomelessRootTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи бомжа */
  places: IPlaces;
  /** Фабрика, которой задачи собирают психику из слепка, чтобы предсказать её реакцию в эффектах */
  psycheFactory: IPsycheFactory;
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
      psycheFactory,
      random,
      timer,
      npcTaskFactory = new NpcTaskFactory({
        geometry,
        psycheFactory,
        random,
        timer,
      }),
      homelessTaskFactory = new HomelessTaskFactory({
        npcTaskFactory,
        places,
        psycheFactory,
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
