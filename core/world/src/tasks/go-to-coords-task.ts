import type { GoToCoordsOptions, IActor, IActorCommand } from '@peetland/game';

import type { NpcState } from '../npc';

import { CommandTask } from './command-task';

/** Идти к координатам (см. IActor.goToCoords) */
export class GoToCoordsTask extends CommandTask {
  readonly name = 'go-to-coords';

  private readonly options: GoToCoordsOptions;

  constructor(options: GoToCoordsOptions) {
    super();
    this.options = options;
  }

  /** Актор оказывается на координатах */
  applyEffects(state: NpcState): NpcState {
    const { coords } = this.options;
    const actor = { ...state.actor, position: coords };

    return { ...state, actor };
  }

  protected createCommand(actor: IActor): IActorCommand {
    const { coords, completeRadius } = this.options;

    return actor.goToCoords(coords, completeRadius);
  }
}
