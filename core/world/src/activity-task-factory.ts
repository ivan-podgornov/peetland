import type { IGeometry } from '@peetland/geometry';
import { HomelessActivityTaskFactory } from '@peetland/homeless';
import type { Task } from '@peetland/htn';
import { NpcKind } from '@peetland/npc';
import type { IActivityTaskFactory, NpcContext, NpcState } from '@peetland/npc';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import type { ILayerTaskFactory } from './types';

/** Фабрика деятельности для каждого типа NPC */
export type KindActivityTaskFactories = Readonly<Record<NpcKind, IActivityTaskFactory>>;

export type ActivityTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи NPC */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /**
   * Фабрики деятельности, которые заменяют фабрики по умолчанию. По умолчанию у каждого типа NPC
   * фабрика из его пакета с задачами
   */
  kindFactories?: Partial<KindActivityTaskFactories>;
};

/** Создаёт слой деятельности корневой задачи NPC фабрикой его типа */
export class ActivityTaskFactory implements ILayerTaskFactory {
  private readonly kindFactories: KindActivityTaskFactories;

  constructor(deps: ActivityTaskFactoryDeps) {
    const { kindFactories = {}, ...shared } = deps;

    this.kindFactories = {
      [NpcKind.Homeless]:
        kindFactories[NpcKind.Homeless] ?? new HomelessActivityTaskFactory(shared),
    };
  }

  create(kind: NpcKind): Task<NpcState, NpcContext> {
    const { kindFactories } = this;

    return kindFactories[kind].create();
  }
}
