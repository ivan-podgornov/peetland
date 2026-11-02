import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { IPsycheFactory } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';

import { BegTask } from './beg-task';
import type { BegTaskOptions } from './beg-task';
import { BuyBoozeTask } from './buy-booze-task';
import type { BuyBoozeTaskOptions } from './buy-booze-task';
import { CollectBottlesTask } from './collect-bottles-task';
import type { CollectBottlesTaskOptions } from './collect-bottles-task';
import { DrinkTask } from './drink-task';
import type { DrinkTaskOptions } from './drink-task';
import { PurchaseTask } from './purchase-task';
import type { PurchaseTaskOptions } from './purchase-task';
import { SellBottlesTask } from './sell-bottles-task';
import type { SellBottlesTaskOptions } from './sell-bottles-task';

type NpcTask = Task<NpcState, NpcContext>;

/**
 * Создаёт составные задачи бомжа. Через неё составные задачи собирают методы из других составных
 * задач, а примитивы берут у фабрики примитивов (см. INpcTaskFactory)
 */
export interface IHomelessTaskFactory {
  /** Купить предмет там, где NPC стоит (см. PurchaseTask) */
  purchase(options: PurchaseTaskOptions): NpcTask;
  /** Купить пойло в ближайшем магазине (см. BuyBoozeTask) */
  buyBooze(options: BuyBoozeTaskOptions): NpcTask;
  /** Бухать в бомжарне (см. DrinkTask) */
  drink(options: DrinkTaskOptions): NpcTask;
  /** Сдать бутылки в ближайшей приёмке (см. SellBottlesTask) */
  sellBottles(options: SellBottlesTaskOptions): NpcTask;
  /** Собрать бутылки в случайной мусорке (см. CollectBottlesTask) */
  collectBottles(options: CollectBottlesTaskOptions): NpcTask;
  /** Клянчить у ближайшего места для клянчанья (см. BegTask) */
  beg(options: BegTaskOptions): NpcTask;
}

export type HomelessTaskFactoryDeps = {
  /** Фабрика примитивов, которую получают создаваемые задачи */
  npcTaskFactory: INpcTaskFactory;
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

  buyBooze(options: BuyBoozeTaskOptions): NpcTask {
    const { npcTaskFactory } = this.deps;

    return new BuyBoozeTask(options, {
      npcTaskFactory,
      homelessTaskFactory: this,
    });
  }

  drink(options: DrinkTaskOptions): NpcTask {
    const { npcTaskFactory } = this.deps;

    return new DrinkTask(options, { npcTaskFactory });
  }

  sellBottles(options: SellBottlesTaskOptions): NpcTask {
    const { npcTaskFactory } = this.deps;

    return new SellBottlesTask(options, { npcTaskFactory });
  }

  collectBottles(options: CollectBottlesTaskOptions): NpcTask {
    const { npcTaskFactory, random } = this.deps;

    return new CollectBottlesTask(options, {
      npcTaskFactory,
      random,
    });
  }

  beg(options: BegTaskOptions): NpcTask {
    const { npcTaskFactory, psycheFactory } = this.deps;

    return new BegTask(options, {
      npcTaskFactory,
      psycheFactory,
    });
  }
}
