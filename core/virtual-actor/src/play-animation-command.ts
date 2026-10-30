import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import { assertPlaybackDuration } from '@peetland/game';
import type { AnimationId, IActor } from '@peetland/game';

/** Анимация виртуального актора */
export type VirtualAnimation = {
  /** Сколько длится анимация, в миллисекундах */
  duration: number;
};

/** Анимации виртуального актора. Для каждой анимации должна быть задана длительность */
export type VirtualAnimations = Record<AnimationId, VirtualAnimation>;

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
  /** Таблица анимаций, из которой берётся длительность, если время проигрывания не передано */
  animations: VirtualAnimations;
};

/**
 * Завершается, когда по таймеру проходит переданное время проигрывания, а если его не передали, —
 * длительность анимации из таблицы анимаций. Выбрасывает ошибку при создании, если время проигрывания не
 * подходит анимации (см. assertPlaybackDuration) или в таблице не задана длительность
 */
export class VirtualPlayAnimationCommand extends Command<
  void,
  VirtualPlayAnimationCommandOptions,
  VirtualPlayAnimationCommandDeps
> {
  /** Сколько проигрывать анимацию, в миллисекундах */
  private readonly duration: number;
  /** Сколько миллисекунд анимация уже проигрывается */
  private playedFor: number;

  constructor(
    actor: IActor,
    options: VirtualPlayAnimationCommandOptions,
    deps: VirtualPlayAnimationCommandDeps
  ) {
    const duration = getDuration(options, deps.animations);

    // Виртуальной анимации нечего делать между тиками, поэтому период равен длительности: так
    // команда завершается ровно тогда, когда проходит duration, а не на ближайшем тике после
    super({ name: 'play-animation', updatePeriod: duration }, actor, options, deps);
    this.duration = duration;
    this.playedFor = 0;
  }

  protected onUpdate(elapsed: number): CommandStatus {
    this.playedFor += elapsed;

    return this.playedFor >= this.duration ? 'success' : 'running';
  }
}

/**
 * Возвращает, сколько проигрывать анимацию. Выбрасывает ошибку, если время проигрывания не подходит
 * анимации или его не передали, а в таблице не задана длительность
 */
function getDuration(
  options: VirtualPlayAnimationCommandOptions,
  animations: VirtualAnimations
): number {
  const { animation, playbackDuration } = options;
  assertPlaybackDuration(animation, playbackDuration);

  if (playbackDuration !== undefined) {
    return playbackDuration;
  }

  const info: Partial<VirtualAnimation> | undefined = animations[animation];

  if (info?.duration === undefined) {
    throw new Error(`Не задана длительность анимации ${animation}`);
  }

  return info.duration;
}
