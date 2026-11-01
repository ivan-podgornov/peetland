import type { IActor, IActorCommand } from '@peetland/game';

import type { NpcState } from '../npc';
import type { PlaceData } from '../places';

import { NearestPlaceTask } from './nearest-place-task';
import type { NearestPlaceTaskDeps } from './nearest-place-task';

export type AchieveNearestPlaceAngleTaskOptions = {
  /** Места, из которых выбирается ближайшее */
  places: readonly PlaceData[];
  /** Допустимое отклонение в градусах (см. IActor.achieveAngle) */
  tolerance: number;
};

/**
 * Повернуться на угол места, ближайшего к актору (см. PlaceData.angle), например, чтобы оказаться
 * лицом к прилавку. Ставится в план после того, как актор дошёл до места
 */
export class AchieveNearestPlaceAngleTask extends NearestPlaceTask {
  readonly name = 'achieve-nearest-place-angle';

  private readonly tolerance: number;

  constructor(options: AchieveNearestPlaceAngleTaskOptions, deps: NearestPlaceTaskDeps) {
    super(options.places, deps);
    this.tolerance = options.tolerance;
  }

  /** Актор оказывается повёрнут на угол ближайшего места, приведённый к [0, 360) */
  applyEffects(state: NpcState): NpcState {
    const { geometry } = this.deps;
    const place = this.findNearest(state.actor.position);
    const angle = geometry.normalizeAngle(place.angle);
    const actor = { ...state.actor, angle };

    return { ...state, actor };
  }

  protected createCommand(actor: IActor): IActorCommand {
    const place = this.findNearest(actor.getPosition());

    return actor.achieveAngle(place.angle, this.tolerance);
  }
}
