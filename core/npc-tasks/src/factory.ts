import type { AchieveAngleOptions, GoToCoordsOptions } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import { ParallelTask } from '@peetland/htn';
import type { ParallelTaskOptions, Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
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
import { PurchaseTask } from './purchase-task';
import { RemoveItemTask } from './remove-item-task';
import type { RemoveItemTaskOptions } from './remove-item-task';
import { TryLuckTask } from './try-luck-task';
import type { TryLuckTaskOptions } from './try-luck-task';
import type { INpcTaskFactory, NpcPrimitiveTask, PurchaseTaskOptions } from './types';

export type NpcTaskFactoryDeps = {
  geometry: IGeometry;
  random: IRandom;
  timer: ITimer;
};

export class NpcTaskFactory implements INpcTaskFactory {
  private readonly deps: NpcTaskFactoryDeps;

  constructor(deps: NpcTaskFactoryDeps) {
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

  psycheReact(options: PsycheReactTaskOptions): NpcPrimitiveTask {
    return new PsycheReactTask(options);
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

  purchase(options: PurchaseTaskOptions): Task<NpcState, NpcContext> {
    return new PurchaseTask(options, { npcTaskFactory: this });
  }
}
