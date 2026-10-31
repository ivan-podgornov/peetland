import type { AchieveAngleOptions, IActor, IActorCommand } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';

import type { NpcState } from '../npc';

import { CommandTask } from './command-task';

export type AchieveAngleTaskDeps = {
  geometry: IGeometry;
};

/** Повернуться на угол (см. IActor.achieveAngle) */
export class AchieveAngleTask extends CommandTask {
  readonly name = 'achieve-angle';

  private readonly options: AchieveAngleOptions;
  private readonly deps: AchieveAngleTaskDeps;

  constructor(options: AchieveAngleOptions, deps: AchieveAngleTaskDeps) {
    super();
    this.options = options;
    this.deps = deps;
  }

  /** Актор оказывается повёрнут на угол, приведённый к [0, 360) */
  applyEffects(state: NpcState): NpcState {
    const { geometry } = this.deps;
    const angle = geometry.normalizeAngle(this.options.angle);

    return { ...state, actor: { ...state.actor, angle } };
  }

  protected createCommand(actor: IActor): IActorCommand {
    const { angle, tolerance } = this.options;

    return actor.achieveAngle(angle, tolerance);
  }
}
