import type { AnimationId, IActor, IActorCommand } from '@peetland/game';

import type { NpcState } from '../npc';

import { CommandTask } from './command-task';

export type PlayAnimationTaskOptions = {
  /** Какую анимацию проиграть */
  animation: AnimationId;
  /** Сколько проигрывать зацикленную анимацию, в миллисекундах (см. IActor.playAnimation) */
  duration?: number;
};

/** Проиграть анимацию (см. IActor.playAnimation) */
export class PlayAnimationTask extends CommandTask {
  readonly name = 'play-animation';

  private readonly options: PlayAnimationTaskOptions;

  constructor(options: PlayAnimationTaskOptions) {
    super();
    this.options = options;
  }

  /** Анимация состояние не меняет */
  applyEffects(state: NpcState): NpcState {
    return state;
  }

  protected createCommand(actor: IActor): IActorCommand {
    const { animation, duration } = this.options;

    return actor.playAnimation(animation, duration);
  }
}
