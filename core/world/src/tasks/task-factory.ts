import type { AchieveAngleOptions, GoToCoordsOptions } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import type { PrimitiveTask } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';

import { AchieveAngleTask } from './achieve-angle-task';
import { AddItemTask } from './add-item-task';
import type { AddItemTaskOptions } from './add-item-task';
import { GoToCoordsTask } from './go-to-coords-task';
import { PlayAnimationTask } from './play-animation-task';
import type { PlayAnimationTaskOptions } from './play-animation-task';
import { RemoveItemTask } from './remove-item-task';
import type { RemoveItemTaskOptions } from './remove-item-task';

type NpcPrimitiveTask = PrimitiveTask<NpcState, NpcContext>;

/** Создаёт примитивные задачи NPC. Через неё составные задачи собирают свои методы */
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
}
