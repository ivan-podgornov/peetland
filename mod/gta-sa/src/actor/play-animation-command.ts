import type { ISubscriber } from '@peetland/events';
import type { IActorCommand } from '@peetland/game';
import type { PedHandle } from '@peetland/moonloader';
import {
  clearCharTasksImmediately,
  hasAnimationLoaded,
  removeAnimation,
  requestAnimation,
  taskPlayAnim,
} from '@peetland/moonloader';

import type { ITimer } from '@peetland/timings';

import { ALWAYS_LOADED_BLOCK } from './animations';
import type { GtaAnimation } from './animations';

export type GtaPlayAnimationCommandDeps = {
  timer: ITimer;
};

/** Как часто команда проверяет, загрузился ли блок и закончилась ли анимация, в миллисекундах */
const CHECK_PERIOD = 100;

/** Скорость перехода в анимацию из текущей позы. 4 — обычное значение для анимаций в игре */
const BLEND_SPEED = 4;

/**
 * Загружает блок анимации, проигрывает её и завершается, когда проходит её длительность.
 * Блок выгружается, как только команда завершилась или прервалась
 */
export class GtaPlayAnimationCommand implements IActorCommand {
  readonly name = 'play-animation';
  private readonly handle: PedHandle;
  private readonly subscriber: ISubscriber<void>;
  private readonly animation: GtaAnimation;
  private readonly timer: ITimer;
  /** Сколько миллисекунд анимация уже проигрывается. null, если блок ещё загружается */
  private playedFor: number | null;

  constructor(
    handle: PedHandle,
    subscriber: ISubscriber<void>,
    animation: GtaAnimation,
    deps: GtaPlayAnimationCommandDeps
  ) {
    this.handle = handle;
    this.subscriber = subscriber;
    this.animation = animation;
    this.timer = deps.timer;
    this.playedFor = null;
  }

  start(): void {
    const { block } = this.animation;

    if (block !== ALWAYS_LOADED_BLOCK) {
      requestAnimation(block);
      this.subscriber.addTeardown(() => removeAnimation(block));
    }

    this.tryPlay();
    this.timer
      .interval(CHECK_PERIOD)
      .subscribe((elapsed) => this.update(elapsed), { signal: this.subscriber.signal });
  }

  stop(): void {
    this.subscriber.complete();
  }

  cancel(reason: unknown): void {
    clearCharTasksImmediately(this.handle);
    this.subscriber.error(reason);
  }

  /** Ждёт загрузки блока, а после начала анимации завершает команду, когда проходит её длительность */
  private update(elapsed: number): void {
    if (this.playedFor === null) {
      this.tryPlay();
      return;
    }

    this.playedFor += elapsed;

    if (this.playedFor >= this.animation.duration) {
      this.stop();
    }
  }

  /** Начинает анимацию, если её блок загружен */
  private tryPlay(): void {
    const { block, name } = this.animation;

    if (block !== ALWAYS_LOADED_BLOCK && !hasAnimationLoaded(block)) {
      return;
    }

    taskPlayAnim(this.handle, name, block, BLEND_SPEED, false, false, false, false, -1);
    this.playedFor = 0;
  }
}
