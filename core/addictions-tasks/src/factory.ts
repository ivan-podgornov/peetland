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

import { AddictionsTask } from './addictions-task';
import { BuyBoozeTask } from './buy-booze-task';
import { SatisfyAlcoholismTask } from './satisfy-alcoholism-task';
import type { BuyBoozeTaskOptions, IAddictionsTaskFactory } from './types';

export type AddictionsTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /** Фабрика задач NPC, которую получают задачи. По умолчанию — NpcTaskFactory */
  npcTaskFactory?: INpcTaskFactory;
  /** Классификатор предметов, которым задачи ищут пойло. По умолчанию — ItemClassifier */
  itemClassifier?: IItemClassifier;
};

/** Создаёт задачи удовлетворения зависимостей. На каждый вызов задача новая */
export class AddictionsTaskFactory implements IAddictionsTaskFactory {
  private readonly places: IPlaces;
  private readonly npcTaskFactory: INpcTaskFactory;
  private readonly itemClassifier: IItemClassifier;

  constructor(deps: AddictionsTaskFactoryDeps) {
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

  satisfyAddictions(): Task<NpcState, NpcContext> {
    return new AddictionsTask({ addictionsTaskFactory: this });
  }

  satisfyAlcoholism(): Task<NpcState, NpcContext> {
    const { places, npcTaskFactory, itemClassifier } = this;

    return new SatisfyAlcoholismTask({
      npcTaskFactory,
      addictionsTaskFactory: this,
      places,
      itemClassifier,
    });
  }

  buyBooze(options: BuyBoozeTaskOptions): Task<NpcState, NpcContext> {
    const { npcTaskFactory } = this;

    return new BuyBoozeTask(options, { npcTaskFactory });
  }
}
