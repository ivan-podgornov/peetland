import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandResult, CommandStatus } from '@peetland/actor-command';
import { ANIMATIONS, assertPlaybackDuration } from '@peetland/game';
import type { AnimationId, IActor } from '@peetland/game';
import type { PedHandle } from '@peetland/moonloader';
import {
  clearCharTasks,
  clearCharTasksImmediately,
  hasAnimationLoaded,
  removeAnimation,
  requestAnimation,
  taskPlayAnim,
} from '@peetland/moonloader';

import { ALWAYS_LOADED_BLOCK, GTA_ANIMATIONS } from './animations';
import type { GtaAnimation } from './animations';

export type GtaPlayAnimationCommandOptions = {
  /** Персонаж, который проигрывает анимацию */
  handle: PedHandle;
  /** Какую анимацию проиграть */
  animation: AnimationId;
  /**
   * Сколько проигрывать зацикленную анимацию, в миллисекундах. Если не передано, анимация идёт
   * длительность из GTA_ANIMATIONS. Для незацикленной не передаётся
   */
  playbackDuration?: number | undefined;
};

export type GtaPlayAnimationCommandDeps = CommandDeps;

/**
 * Команда проверяет, загрузился ли блок и закончилась ли анимация, раз в 100 миллисекунд
 */
const PLAY_ANIMATION = { name: 'play-animation', updatePeriod: 100 };

/** Скорость перехода в анимацию из текущей позы. 4 — обычное значение для анимаций в игре */
const BLEND_SPEED = 4;

/**
 * Загружает блок анимации, проигрывает её и завершается, когда проходит время проигрывания.
 * Зацикленную анимацию по завершении плавно останавливает, а прерванную — сразу. Блок выгружается,
 * как только команда закончилась. Выбрасывает ошибку при создании, если время проигрывания не
 * подходит анимации (см. assertPlaybackDuration)
 */
export class GtaPlayAnimationCommand extends Command<
  void,
  GtaPlayAnimationCommandOptions,
  GtaPlayAnimationCommandDeps
> {
  /** Анимация игры, которой показывается анимация актора */
  private readonly gtaAnimation: GtaAnimation;
  /** Повторять ли анимацию, пока не пройдёт duration */
  private readonly loop: boolean;
  /** Сколько проигрывать анимацию, в миллисекундах */
  private readonly duration: number;
  /** Сколько миллисекунд анимация уже проигрывается. null, если блок ещё загружается */
  private playedFor: number | null;

  constructor(
    actor: IActor,
    options: GtaPlayAnimationCommandOptions,
    deps: GtaPlayAnimationCommandDeps
  ) {
    const { animation, playbackDuration } = options;
    assertPlaybackDuration(animation, playbackDuration);

    super(PLAY_ANIMATION, actor, options, deps);
    this.gtaAnimation = GTA_ANIMATIONS[animation];
    this.loop = ANIMATIONS[animation].loop;
    this.duration = playbackDuration ?? this.gtaAnimation.duration;
    this.playedFor = null;
  }

  protected override onStart(): void {
    const { block } = this.gtaAnimation;

    if (block !== ALWAYS_LOADED_BLOCK) {
      requestAnimation(block);
    }
  }

  /** Ждёт загрузки блока, а после начала анимации завершает команду, когда проходит время проигрывания */
  protected onUpdate(elapsed: number): CommandStatus {
    if (this.playedFor === null) {
      this.tryPlay();
      return 'running';
    }

    this.playedFor += elapsed;

    return this.playedFor >= this.duration ? 'success' : 'running';
  }

  protected override onFinish(result: CommandResult): void {
    const { handle } = this.options;
    const { block } = this.gtaAnimation;

    if (result !== 'success') {
      clearCharTasksImmediately(handle);
    } else if (this.loop) {
      clearCharTasks(handle);
    }

    if (block !== ALWAYS_LOADED_BLOCK) {
      removeAnimation(block);
    }
  }

  /** Начинает анимацию, если её блок загружен */
  private tryPlay(): void {
    const { block, name } = this.gtaAnimation;

    if (block !== ALWAYS_LOADED_BLOCK && !hasAnimationLoaded(block)) {
      return;
    }

    taskPlayAnim(this.options.handle, name, block, BLEND_SPEED, this.loop, false, false, false, -1);
    this.playedFor = 0;
  }
}
