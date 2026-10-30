import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import type { IAnimationManager } from '@peetland/animation-manager';
import type { AnimationId, IActor } from '@peetland/game';

import type { VirtualAnimation } from './animations';

export type VirtualPlayAnimationCommandOptions = {
  /** Какую анимацию проиграть */
  animation: AnimationId;
  /**
   * Сколько проигрывать зацикленную анимацию, в миллисекундах. Если не передано, анимация идёт
   * длительность из таблицы. Для незацикленной не передаётся
   */
  playbackDuration?: number | undefined;
};

export type VirtualPlayAnimationCommandDeps = CommandDeps & {
  animations: IAnimationManager<VirtualAnimation>;
};

/**
 * Ждёт, пока менеджер загрузит анимацию, и завершается, когда по таймеру проходит время
 * проигрывания. Выбрасывает ошибку при создании, если параметры не подходят анимации (см.
 * IAnimationManager.resolve)
 */
export class VirtualPlayAnimationCommand extends Command<
  void,
  VirtualPlayAnimationCommandOptions,
  VirtualPlayAnimationCommandDeps
> {
  /** Сколько проигрывать анимацию, в миллисекундах */
  private readonly duration: number;
  /** Сколько миллисекунд анимация уже проигрывается. null, пока анимация не загружена */
  private playedFor: number | null;

  constructor(
    actor: IActor,
    options: VirtualPlayAnimationCommandOptions,
    deps: VirtualPlayAnimationCommandDeps
  ) {
    const { duration } = deps.animations.resolve(options.animation, options.playbackDuration);

    // Виртуальной анимации нечего делать между тиками, поэтому период равен длительности: так
    // команда завершается ровно тогда, когда проходит duration, а не на ближайшем тике после
    super({ name: 'play-animation', updatePeriod: duration }, actor, options, deps);
    this.duration = duration;
    this.playedFor = null;
  }

  protected override onStart(): void {
    this.deps.animations
      .acquire(this.options.animation)
      .subscribe(() => (this.playedFor = 0), { signal: this.signal });
  }

  protected onUpdate(elapsed: number): CommandStatus {
    if (this.playedFor === null) {
      return 'running';
    }

    this.playedFor += elapsed;

    return this.playedFor >= this.duration ? 'success' : 'running';
  }
}
