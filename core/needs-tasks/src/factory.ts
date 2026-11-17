import type { IGeometry } from '@peetland/geometry';
import type { Task } from '@peetland/htn';
import { ItemClassifier } from '@peetland/inventory';
import type { IItemClassifier } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcTaskFactory } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { NeedsTask } from './needs-task';
import { SatisfyHungerTask } from './satisfy-hunger-task';
import type { INeedsTaskFactory } from './types';

export type NeedsTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /** Фабрика задач NPC, которую получают задачи. По умолчанию — NpcTaskFactory */
  npcTaskFactory?: INpcTaskFactory;
  /** Классификатор предметов. По умолчанию — ItemClassifier */
  itemClassifier?: IItemClassifier;
};

/** Создаёт задачи удовлетворения потребностей. На каждый вызов задача новая */
export class NeedsTaskFactory implements INeedsTaskFactory {
  private readonly places: IPlaces;
  private readonly npcTaskFactory: INpcTaskFactory;
  private readonly itemClassifier: IItemClassifier;

  constructor(deps: NeedsTaskFactoryDeps) {
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
      itemClassifier = new ItemClassifier(),
    } = deps;

    this.places = places;
    this.npcTaskFactory = npcTaskFactory;
    this.itemClassifier = itemClassifier;
  }

  satisfyNeeds(): Task<NpcState, NpcContext> {
    return new NeedsTask({ needsTaskFactory: this });
  }

  satisfyHunger(): Task<NpcState, NpcContext> {
    const { places, npcTaskFactory, itemClassifier } = this;

    return new SatisfyHungerTask({
      npcTaskFactory,
      places,
      itemClassifier,
    });
  }
}
