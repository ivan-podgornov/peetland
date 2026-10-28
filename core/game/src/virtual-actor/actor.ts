import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import type { AnimationId, IActor, IActorCommand } from '../actor';

import { VirtualGoToCoordsCommand } from './go-to-coords-command';
import { VirtualPlayAnimationCommand } from './play-animation-command';

/** Длительность анимации, для которой нет записи в таблице длительностей, в миллисекундах */
export const DEFAULT_ANIMATION_DURATION = 1000;

/** Длительности анимаций в миллисекундах */
export type AnimationDurations = Partial<Record<AnimationId, number>>;

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
  /**
   * Длительности анимаций. Для анимаций без записи используется DEFAULT_ANIMATION_DURATION.
   * Если не указаны, все анимации длятся DEFAULT_ANIMATION_DURATION
   */
  animationDurations?: AnimationDurations;
};

export type VirtualActorDeps = {
  geometry: IGeometry;
  timer: ITimer;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor implements IActor {
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;
  private readonly animationDurations: AnimationDurations;
  private position: Vector3;
  private command: IActorCommand | null;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    this.geometry = deps.geometry;
    this.timer = deps.timer;
    this.animationDurations = { ...options.animationDurations };
    this.position = { ...options.position };
    this.command = null;
  }

  get currentCommand(): IActorCommand | null {
    return this.command;
  }

  getPosition(): Vector3 {
    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    return new Observable((subscriber: ISubscriber<Vector3>) => {
      const command = new VirtualGoToCoordsCommand(
        this,
        subscriber,
        { coords, completeRadius },
        { geometry: this.geometry, timer: this.timer }
      );

      this.execute(command, subscriber);
    });
  }

  playAnimation(animation: AnimationId): Observable<void> {
    return new Observable((subscriber: ISubscriber<void>) => {
      const duration = this.animationDurations[animation] ?? DEFAULT_ANIMATION_DURATION;
      const command = new VirtualPlayAnimationCommand(
        subscriber,
        { duration },
        { timer: this.timer }
      );

      this.execute(command, subscriber);
    });
  }

  despawn(): void {
    this.command?.cancel(new Error('Актор деспавнен'));
  }

  /** Прерывает текущую команду и начинает новую. Команда перестаёт быть текущей, когда завершится */
  private execute<T>(command: IActorCommand, subscriber: ISubscriber<T>): void {
    this.command?.cancel(new Error('Актор получил другую команду'));
    this.command = command;

    subscriber.addTeardown(() => {
      if (this.command === command) {
        this.command = null;
      }
    });

    command.start();
  }
}
