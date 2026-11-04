import type { AchieveAngleOptions, GoToCoordsOptions } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import { ParallelTask } from '@peetland/htn';
import type { ParallelTaskOptions, PrimitiveTask, Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import { PsycheFactory } from '@peetland/psyche';
import type { IPsycheFactory } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { AchieveAngleTask } from './achieve-angle-task';
import { AddItemTask } from './add-item-task';
import type { AddItemTaskOptions } from './add-item-task';
import { GoToCoordsTask } from './go-to-coords-task';
import { PlayAnimationTask } from './play-animation-task';
import type { PlayAnimationTaskOptions } from './play-animation-task';
import { PsycheReactTask } from './psyche-react-task';
import type { PsycheReactTaskOptions } from './psyche-react-task';
import { RemoveItemTask } from './remove-item-task';
import type { RemoveItemTaskOptions } from './remove-item-task';
import { TryLuckTask } from './try-luck-task';
import type { TryLuckTaskOptions } from './try-luck-task';

type NpcPrimitiveTask = PrimitiveTask<NpcState, NpcContext>;

type NpcTask = Task<NpcState, NpcContext>;

/**
 * Создаёт примитивные задачи, которые нужны любому NPC, и повторяет цепочки из них. Через неё
 * составные задачи собирают свои методы
 */
export interface INpcTaskFactory {
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
  /** Сообщить психике о поступке (см. PsycheReactTask) */
  psycheReact(options: PsycheReactTaskOptions): NpcPrimitiveTask;
  /** Пытать удачу, пока не повезёт (см. TryLuckTask) */
  tryLuck(options: TryLuckTaskOptions): NpcPrimitiveTask;
  /** Выполнять основную задачу и одновременно с ней фоновую (см. ParallelTask) */
  parallel(options: ParallelTaskOptions<NpcState, NpcContext>): NpcPrimitiveTask;
  /**
   * Повторить цепочку задач times раз и вернуть повторения подряд одним массивом. build создаёт одну
   * цепочку и вызывается на каждое повторение, чтобы у повторений были свои экземпляры задач. Если
   * times — не целое неотрицательное число, выбрасывает ошибку
   */
  repeat(times: number, build: () => NpcTask[]): NpcTask[];
}

export type NpcTaskFactoryDeps = {
  geometry: IGeometry;
  /**
   * Фабрика, которой задачи собирают психику из слепка, чтобы предсказать её реакцию в эффектах. По
   * умолчанию — PsycheFactory
   */
  psycheFactory?: IPsycheFactory;
  random: IRandom;
  timer: ITimer;
};

export class NpcTaskFactory implements INpcTaskFactory {
  private readonly deps: Required<NpcTaskFactoryDeps>;

  constructor(deps: NpcTaskFactoryDeps) {
    const { geometry, psycheFactory = new PsycheFactory(), random, timer } = deps;

    this.deps = {
      geometry,
      psycheFactory,
      random,
      timer,
    };
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

  psycheReact(options: PsycheReactTaskOptions): NpcPrimitiveTask {
    const { psycheFactory } = this.deps;

    return new PsycheReactTask(options, { psycheFactory });
  }

  tryLuck(options: TryLuckTaskOptions): NpcPrimitiveTask {
    const { random, timer } = this.deps;

    return new TryLuckTask(options, {
      random,
      timer,
    });
  }

  parallel(options: ParallelTaskOptions<NpcState, NpcContext>): NpcPrimitiveTask {
    return new ParallelTask(options);
  }

  repeat(times: number, build: () => NpcTask[]): NpcTask[] {
    // Остаток от деления на 1 не равен 0 и у дробного числа, и у NaN, и у бесконечности
    if (times < 0 || times % 1 !== 0) {
      throw new Error(`Нельзя повторить цепочку задач ${times} раз`);
    }

    const tasks: NpcTask[] = [];

    for (let index = 0; index < times; index++) {
      tasks.push(...build());
    }

    return tasks;
  }
}
