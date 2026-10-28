import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import type { AnimationId, IActor, IActorCommand } from '../actor';

import { VirtualGoToCoordsCommand } from './go-to-coords-command';
import { VirtualPlayAnimationCommand } from './play-animation-command';

/** Анимация виртуального актора */
export type VirtualAnimation = {
  /** Сколько длится анимация, в миллисекундах */
  duration: number;
};

/** Анимации виртуального актора. Для каждой анимации должна быть задана длительность */
export type VirtualAnimations = Record<AnimationId, VirtualAnimation>;

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
  /** Анимации, которые умеет проигрывать актор */
  animations: VirtualAnimations;
};

export type VirtualActorDeps = {
  geometry: IGeometry;
  timer: ITimer;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor implements IActor {
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;
  private readonly animations: VirtualAnimations;
  private position: Vector3;
  private command: IActorCommand | null;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    this.geometry = deps.geometry;
    this.timer = deps.timer;
    this.animations = { ...options.animations };
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

  /**
   * Выбрасывает ошибку, если анимации нет в таблице анимаций или для неё не задана длительность
   * @inheritdoc
   */
  playAnimation(animation: AnimationId): Observable<void> {
    const duration = this.getAnimationDuration(animation);

    return new Observable((subscriber: ISubscriber<void>) => {
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

  /** Возвращает длительность анимации. Выбрасывает ошибку, если длительность не задана */
  private getAnimationDuration(animation: AnimationId): number {
    const info: Partial<VirtualAnimation> | undefined = this.animations[animation];

    if (info?.duration === undefined) {
      throw new Error(`Не задана длительность анимации ${animation}`);
    }

    return info.duration;
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
