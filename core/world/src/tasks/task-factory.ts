import type { AchieveAngleOptions, GoToCoordsOptions } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import { ParallelTask } from '@peetland/htn';
import type { ParallelTaskOptions, PrimitiveTask, Task } from '@peetland/htn';
import type { IPsycheFactory } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import type { NpcContext, NpcState } from '../npc';

import { AchieveAngleTask } from './achieve-angle-task';
import { AddItemTask } from './add-item-task';
import type { AddItemTaskOptions } from './add-item-task';
import { BuyBoozeTask } from './buy-booze-task';
import type { BuyBoozeTaskOptions } from './buy-booze-task';
import { CollectBottlesTask } from './collect-bottles-task';
import type { CollectBottlesTaskOptions } from './collect-bottles-task';
import { DrinkTask } from './drink-task';
import type { DrinkTaskOptions } from './drink-task';
import { GoToCoordsTask } from './go-to-coords-task';
import { PlayAnimationTask } from './play-animation-task';
import type { PlayAnimationTaskOptions } from './play-animation-task';
import { PurchaseTask } from './purchase-task';
import type { PurchaseTaskOptions } from './purchase-task';
import { ReactTask } from './react-task';
import type { ReactTaskOptions } from './react-task';
import { RemoveItemTask } from './remove-item-task';
import type { RemoveItemTaskOptions } from './remove-item-task';
import { SellBottlesTask } from './sell-bottles-task';
import type { SellBottlesTaskOptions } from './sell-bottles-task';
import { TryLuckTask } from './try-luck-task';
import type { TryLuckTaskOptions } from './try-luck-task';

type NpcPrimitiveTask = PrimitiveTask<NpcState, NpcContext>;
type NpcTask = Task<NpcState, NpcContext>;

/** Создаёт задачи NPC. Через неё составные задачи собирают свои методы */
export interface ITaskFactory {
  /** Идти к координатам (см. GoToCoordsTask) */
  goToCoords(options: GoToCoordsOptions): NpcPrimitiveTask;
  /** Повернуться на угол (см. AchieveAngleTask) */
  achieveAngle(options: AchieveAngleOptions): NpcPrimitiveTask;
  /** Проиграть анимацию (см. PlayAnimationTask) */
  playAnimation(options: PlayAnimationTaskOptions): NpcPrimitiveTask;
  /** Добавить предмет в инвентарь (см. AddItemTask) */
  addItem(options: AddItemTaskOptions): NpcPrimitiveTask;
  /** Отнять предмет из инвентаря (см. RemoveItemTask) */
  removeItem(options: RemoveItemTaskOptions): NpcPrimitiveTask;
  /** Сообщить психике о поступке (см. ReactTask) */
  react(options: ReactTaskOptions): NpcPrimitiveTask;
  /** Пытать удачу, пока не повезёт (см. TryLuckTask) */
  tryLuck(options: TryLuckTaskOptions): NpcPrimitiveTask;
  /** Выполнять основную задачу и одновременно с ней фоновую (см. ParallelTask) */
  parallel(options: ParallelTaskOptions<NpcState, NpcContext>): NpcPrimitiveTask;
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
}

export type TaskFactoryDeps = {
  geometry: IGeometry;
  /** Фабрика, которой задачи собирают психику из слепка, чтобы предсказать её реакцию в эффектах */
  psycheFactory: IPsycheFactory;
  random: IRandom;
  timer: ITimer;
};

export class TaskFactory implements ITaskFactory {
  private readonly deps: TaskFactoryDeps;

  constructor(deps: TaskFactoryDeps) {
    this.deps = deps;
  }

  goToCoords(options: GoToCoordsOptions): NpcPrimitiveTask {
    return new GoToCoordsTask(options);
  }

  achieveAngle(options: AchieveAngleOptions): NpcPrimitiveTask {
    return new AchieveAngleTask(options, this.deps);
  }

  playAnimation(options: PlayAnimationTaskOptions): NpcPrimitiveTask {
    return new PlayAnimationTask(options);
  }

  addItem(options: AddItemTaskOptions): NpcPrimitiveTask {
    return new AddItemTask(options);
  }

  removeItem(options: RemoveItemTaskOptions): NpcPrimitiveTask {
    return new RemoveItemTask(options);
  }

  react(options: ReactTaskOptions): NpcPrimitiveTask {
    const { psycheFactory } = this.deps;

    return new ReactTask(options, { psycheFactory });
  }

  tryLuck(options: TryLuckTaskOptions): NpcPrimitiveTask {
    const { random, timer } = this.deps;

    return new TryLuckTask(options, { random, timer });
  }

  parallel(options: ParallelTaskOptions<NpcState, NpcContext>): NpcPrimitiveTask {
    return new ParallelTask(options);
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

    return new CollectBottlesTask(options, { taskFactory: this, random });
  }
}
