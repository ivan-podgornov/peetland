import type { IActor, IActorCommand } from '@peetland/game';

import type { NpcState } from '../npc';
import type { PlaceData } from '../places';

import { NearestPlaceTask } from './nearest-place-task';
import type { NearestPlaceTaskDeps } from './nearest-place-task';

export type GoToNearestPlaceTaskOptions = {
  /** Места, из которых выбирается ближайшее */
  places: readonly PlaceData[];
  /** Радиус, при котором можно считать, что актор пришёл (см. IActor.goToCoords) */
  completeRadius: number;
};

/** Идти к месту, ближайшему к актору */
export class GoToNearestPlaceTask extends NearestPlaceTask {
  readonly name = 'go-to-nearest-place';

  private readonly completeRadius: number;

  constructor(options: GoToNearestPlaceTaskOptions, deps: NearestPlaceTaskDeps) {
    super(options.places, deps);
    this.completeRadius = options.completeRadius;
  }

  /** Актор оказывается в ближайшем месте */
  applyEffects(state: NpcState): NpcState {
    const { position } = this.findNearest(state.actor.position);
    const actor = { ...state.actor, position };

    return { ...state, actor };
  }

  protected createCommand(actor: IActor): IActorCommand {
    const { position } = this.findNearest(actor.getPosition());

    return actor.goToCoords(position, this.completeRadius);
  }
}
