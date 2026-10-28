import type { ISubscriber } from '@peetland/events';
import type { ITimer } from '@peetland/timings';

import type { IActorCommand } from '../actor';

export type VirtualPlayAnimationCommandOptions = {
  /** Сколько длится анимация, в миллисекундах */
  duration: number;
};

export type VirtualPlayAnimationCommandDeps = {
  timer: ITimer;
};

/** Завершается, когда по таймеру проходит длительность анимации */
export class VirtualPlayAnimationCommand implements IActorCommand {
  readonly name = 'play-animation';
  private readonly subscriber: ISubscriber<void>;
  private readonly duration: number;
  private readonly timer: ITimer;

  constructor(
    subscriber: ISubscriber<void>,
    options: VirtualPlayAnimationCommandOptions,
    deps: VirtualPlayAnimationCommandDeps
  ) {
    this.subscriber = subscriber;
    this.duration = options.duration;
    this.timer = deps.timer;
  }

  start(): void {
    this.timer
      .interval(this.duration)
      .subscribe(() => this.stop(), { signal: this.subscriber.signal });
  }

  stop(): void {
    this.subscriber.complete();
  }

  cancel(reason: unknown): void {
    this.subscriber.error(reason);
  }
}
