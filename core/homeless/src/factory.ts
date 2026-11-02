import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { IPlaces } from '@peetland/places';
import type { IPsycheFactory } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';

import { BegTask } from './beg-task';
import { BuyBoozeTask } from './buy-booze-task';
import { CollectBottlesTask } from './collect-bottles-task';
import { DrinkTask } from './drink-task';
import { PurchaseTask } from './purchase-task';
import type { PurchaseTaskOptions } from './purchase-task';
import { SellBottlesTask } from './sell-bottles-task';

type NpcTask = Task<NpcState, NpcContext>;

/**
 * Создаёт составные задачи бомжа. Через неё составные задачи собирают методы из других составных
 * задач, а примитивы берут у фабрики примитивов (см. INpcTaskFactory)
 */
export interface IHomelessTaskFactory {
  /** Купить предмет там, где NPC стоит (см. PurchaseTask) */
  purchase(options: PurchaseTaskOptions): NpcTask;
  /** Купить пойло в ближайшем магазине (см. BuyBoozeTask) */
  buyBooze(): NpcTask;
  /** Бухать в бомжарне (см. DrinkTask) */
  drink(): NpcTask;
  /** Сдать бутылки в ближайшей приёмке (см. SellBottlesTask) */
  sellBottles(): NpcTask;
  /** Собрать бутылки в случайной мусорке (см. CollectBottlesTask) */
  collectBottles(): NpcTask;
  /** Клянчить у ближайшего места для клянчанья (см. BegTask) */
  beg(): NpcTask;
}

export type HomelessTaskFactoryDeps = {
  /** Фабрика примитивов, которую получают создаваемые задачи */
  npcTaskFactory: INpcTaskFactory;
  /** Места мира, которые получают создаваемые задачи */
  places: IPlaces;
  /** Фабрика, которой задачи собирают психику из слепка, чтобы предсказать её реакцию в эффектах */
  psycheFactory: IPsycheFactory;
  random: IRandom;
};

export class HomelessTaskFactory implements IHomelessTaskFactory {
  private readonly deps: HomelessTaskFactoryDeps;

  constructor(deps: HomelessTaskFactoryDeps) {
    this.deps = deps;
  }

  purchase(options: PurchaseTaskOptions): NpcTask {
    const { npcTaskFactory } = this.deps;

    return new PurchaseTask(options, { npcTaskFactory });
  }

  buyBooze(): NpcTask {
    const { npcTaskFactory, places } = this.deps;

    return new BuyBoozeTask({
      npcTaskFactory,
      homelessTaskFactory: this,
      places,
    });
  }

  drink(): NpcTask {
    const { npcTaskFactory, places } = this.deps;

    return new DrinkTask({
      npcTaskFactory,
      places,
    });
  }

  sellBottles(): NpcTask {
    const { npcTaskFactory, places } = this.deps;

    return new SellBottlesTask({
      npcTaskFactory,
      places,
    });
  }

  collectBottles(): NpcTask {
    const { npcTaskFactory, places, random } = this.deps;

    return new CollectBottlesTask({
      npcTaskFactory,
      places,
      random,
    });
  }

  beg(): NpcTask {
    const { npcTaskFactory, places, psycheFactory } = this.deps;

    return new BegTask({
      npcTaskFactory,
      places,
      psycheFactory,
    });
  }
}
