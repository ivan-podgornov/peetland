import type { AchieveAngleOptions, GoToCoordsOptions } from '@peetland/game';
import type { ParallelTaskOptions, PrimitiveTask, Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import type {
  AddItemTaskOptions,
  INpcTaskFactory,
  PlayAnimationTaskOptions,
  PsycheReactTaskOptions,
  RemoveItemTaskOptions,
  TryLuckTaskOptions,
} from '@peetland/npc-tasks';
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

type NpcPrimitiveTask = PrimitiveTask<NpcState, NpcContext>;
type NpcTask = Task<NpcState, NpcContext>;

/**
 * Создаёт задачи NPC. Через неё составные задачи собирают свои методы. Примитивные задачи создаёт
 * фабрика примитивов (см. INpcTaskFactory)
 */
export interface ITaskFactory extends INpcTaskFactory {
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

export type TaskFactoryDeps = {
  /** Фабрика, которой создаются примитивные задачи */
  npcTaskFactory: INpcTaskFactory;
  /** Фабрика, которой задачи собирают психику из слепка, чтобы предсказать её реакцию в эффектах */
  psycheFactory: IPsycheFactory;
  random: IRandom;
};

export class TaskFactory implements ITaskFactory {
  private readonly deps: TaskFactoryDeps;

  constructor(deps: TaskFactoryDeps) {
    this.deps = deps;
  }

  goToCoords(options: GoToCoordsOptions): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.goToCoords(options);
  }

  achieveAngle(options: AchieveAngleOptions): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.achieveAngle(options);
  }

  playAnimation(options: PlayAnimationTaskOptions): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.playAnimation(options);
  }

  addItem(options: AddItemTaskOptions): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.addItem(options);
  }

  removeItem(options: RemoveItemTaskOptions): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.removeItem(options);
  }

  psycheReact(options: PsycheReactTaskOptions): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.psycheReact(options);
  }

  tryLuck(options: TryLuckTaskOptions): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.tryLuck(options);
  }

  parallel(options: ParallelTaskOptions<NpcState, NpcContext>): NpcPrimitiveTask {
    const { npcTaskFactory } = this.deps;

    return npcTaskFactory.parallel(options);
  }

  purchase(options: PurchaseTaskOptions): NpcTask {
    return new PurchaseTask(options, { taskFactory: this });
  }

  buyBooze(options: BuyBoozeTaskOptions): NpcTask {
    return new BuyBoozeTask(options, { taskFactory: this });
  }

  drink(options: DrinkTaskOptions): NpcTask {
    return new DrinkTask(options, { taskFactory: this });
  }

  sellBottles(options: SellBottlesTaskOptions): NpcTask {
    return new SellBottlesTask(options, { taskFactory: this });
  }

  collectBottles(options: CollectBottlesTaskOptions): NpcTask {
    const { random } = this.deps;

    return new CollectBottlesTask(options, {
      taskFactory: this,
      random,
    });
  }

  beg(options: BegTaskOptions): NpcTask {
    const { psycheFactory } = this.deps;

    return new BegTask(options, {
      taskFactory: this,
      psycheFactory,
    });
  }
}
