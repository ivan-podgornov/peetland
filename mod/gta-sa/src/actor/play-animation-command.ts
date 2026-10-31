import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandResult, CommandStatus } from '@peetland/actor-command';
import type { AnimationPlayback, IAnimationManager } from '@peetland/animation-manager';
import type { AnimationId, IActor } from '@peetland/game';
import type { PedHandle } from '@peetland/moonloader';
import {
  clearCharTasks,
  clearCharTasksImmediately,
  print,
  taskPlayAnim,
} from '@peetland/moonloader';

import type { GtaAnimation } from './animations';

export type GtaPlayAnimationCommandOptions = {
  /** Персонаж, который проигрывает анимацию */
  handle: PedHandle;
  /** Какую анимацию проиграть */
  animation: AnimationId;
  /**
   * Сколько проигрывать зацикленную анимацию, в миллисекундах. Если не передано, анимация идёт
   * длительность из таблицы анимаций. Для незацикленной не передаётся
   */
  playbackDuration?: number | undefined;
};

export type GtaPlayAnimationCommandDeps = CommandDeps & {
  animations: IAnimationManager<GtaAnimation>;
};

/** Команда проверяет, закончилась ли анимация, раз в 100 миллисекунд */
const PLAY_ANIMATION = { name: 'play-animation', updatePeriod: 100 };

/** Скорость перехода в анимацию из текущей позы. 4 — обычное значение для анимаций в игре */
const BLEND_SPEED = 4;

/**
 * Ждёт, пока менеджер загрузит блок анимации, проигрывает её и завершается, когда проходит время
 * проигрывания. Зацикленную анимацию по завершении плавно останавливает, а прерванную — сразу.
 * Блок нужен команде, пока она не закончилась. Выбрасывает ошибку при создании, если параметры не
 * подходят анимации (см. IAnimationManager.resolve)
 */
export class GtaPlayAnimationCommand extends Command<
  void,
  GtaPlayAnimationCommandOptions,
  GtaPlayAnimationCommandDeps
> {
  /** Что и как проигрывать */
  private readonly playback: AnimationPlayback<GtaAnimation>;
  /** Сколько миллисекунд анимация уже проигрывается. null, пока блок загружается */
  private playedFor: number | null;

  constructor(
    actor: IActor,
    options: GtaPlayAnimationCommandOptions,
    deps: GtaPlayAnimationCommandDeps
  ) {
    const playback = deps.animations.resolve(options.animation, options.playbackDuration);

    super(PLAY_ANIMATION, actor, options, deps);
    this.playback = playback;
    this.playedFor = null;
  }

  protected override onStart(): void {
    this.deps.animations
      .acquire(this.options.animation)
      .subscribe(() => this.play(), { signal: this.signal });
  }

  /** После начала анимации завершает команду, когда проходит время проигрывания */
  protected onUpdate(elapsed: number): CommandStatus {
    if (this.playedFor === null) {
      return 'running';
    }

    this.playedFor += elapsed;

    return this.playedFor >= this.playback.duration ? 'success' : 'running';
  }

  /** Блок ещё загружен: команда отпускает его только после onFinish */
  protected override onFinish(result: CommandResult): void {
    const { handle } = this.options;

    if (result !== 'success') {
      clearCharTasksImmediately(handle);
    } else if (this.playback.loop) {
      clearCharTasks(handle);
    }
  }

  /** Начинает анимацию. Вызывается, когда блок загружен */
  private play(): void {
    const { animation, loop } = this.playback;

    print('А может падает вообще тут?');
    taskPlayAnim(
      this.options.handle,
      animation.name,
      animation.block,
      BLEND_SPEED,
      loop,
      false,
      false,
      false,
      -1
    );
    this.playedFor = 0;
  }
}
