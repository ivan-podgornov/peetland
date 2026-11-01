import type { AchieveAngleOptions, GoToCoordsOptions } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import type { PrimitiveTask, Task } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';

import { AchieveAngleTask } from './achieve-angle-task';
import { AddItemTask } from './add-item-task';
import type { AddItemTaskOptions } from './add-item-task';
import { BuyBoozeTask } from './buy-booze-task';
import type { BuyBoozeTaskOptions } from './buy-booze-task';
import { DrinkTask } from './drink-task';
import type { DrinkTaskOptions } from './drink-task';
import { GoToCoordsTask } from './go-to-coords-task';
import { PlayAnimationTask } from './play-animation-task';
import type { PlayAnimationTaskOptions } from './play-animation-task';
import { PurchaseTask } from './purchase-task';
import type { PurchaseTaskOptions } from './purchase-task';
import { RemoveItemTask } from './remove-item-task';
import type { RemoveItemTaskOptions } from './remove-item-task';

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
  /** Купить предмет там, где NPC стоит (см. PurchaseTask) */
  purchase(options: PurchaseTaskOptions): NpcTask;
  /** Купить пойло в ближайшем магазине (см. BuyBoozeTask) */
  buyBooze(options: BuyBoozeTaskOptions): NpcTask;
  /** Бухать в бомжарне (см. DrinkTask) */
  drink(options: DrinkTaskOptions): NpcTask;
}

export type TaskFactoryDeps = {
  geometry: IGeometry;
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

  purchase(options: PurchaseTaskOptions): NpcTask {
    return new PurchaseTask(options, { taskFactory: this });
  }

  buyBooze(options: BuyBoozeTaskOptions): NpcTask {
    const { geometry } = this.deps;

    return new BuyBoozeTask(options, { geometry, taskFactory: this });
  }

  drink(options: DrinkTaskOptions): NpcTask {
    const { geometry } = this.deps;

    return new DrinkTask(options, { geometry, taskFactory: this });
  }
}
