import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import type { IActor } from '@peetland/game';

export type VirtualPlayAnimationCommandOptions = {
  /** Сколько длится анимация, в миллисекундах */
  duration: number;
};

export type VirtualPlayAnimationCommandDeps = CommandDeps;

/** Завершается, когда по таймеру проходит длительность анимации */
export class VirtualPlayAnimationCommand extends Command<void, VirtualPlayAnimationCommandOptions> {
  /** Сколько миллисекунд анимация уже проигрывается */
  private playedFor: number;

  constructor(
    actor: IActor,
    options: VirtualPlayAnimationCommandOptions,
    deps: VirtualPlayAnimationCommandDeps
  ) {
    // Виртуальной анимации нечего делать между тиками, поэтому период равен длительности: так
    // команда завершается ровно тогда, когда проходит duration, а не на ближайшем тике после
    super({ name: 'play-animation', updatePeriod: options.duration }, actor, options, deps);
    this.playedFor = 0;
  }

  protected onUpdate(elapsed: number): CommandStatus {
    this.playedFor += elapsed;

    return this.playedFor >= this.options.duration ? 'success' : 'running';
  }
}
