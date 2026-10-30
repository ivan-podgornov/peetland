import type { ISubscriber } from '@peetland/events';
import { ActorCommandSlot, assertPlaybackDuration, LegacyCommand } from '@peetland/game';
import type { AnimationId, IActor, IActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

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
  private readonly commands: ActorCommandSlot;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    this.geometry = deps.geometry;
    this.timer = deps.timer;
    this.animations = { ...options.animations };
    this.position = { ...options.position };
    this.commands = new ActorCommandSlot();
  }

  get currentCommand(): IActorCommand | null {
    return this.commands.current;
  }

  getPosition(): Vector3 {
    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  goToCoords(coords: Vector3, completeRadius: number): IActorCommand<Vector3> {
    const command = new LegacyCommand(
      'go-to-coords',
      (subscriber: ISubscriber<Vector3>) =>
        new VirtualGoToCoordsCommand(
          this,
          subscriber,
          { coords, completeRadius },
          { geometry: this.geometry, timer: this.timer }
        )
    );

    return this.commands.bind(command);
  }

  /**
   * Незацикленная анимация длится столько, сколько указано в таблице анимаций. Выбрасывает ошибку,
   * если анимации нет в таблице или для неё не задана длительность
   * @inheritdoc
   */
  playAnimation(animation: AnimationId, playbackDuration?: number): IActorCommand<void> {
    assertPlaybackDuration(animation, playbackDuration);
    const duration = playbackDuration ?? this.getAnimationDuration(animation);

    const command = new LegacyCommand(
      'play-animation',
      (subscriber: ISubscriber<void>) =>
        new VirtualPlayAnimationCommand(subscriber, { duration }, { timer: this.timer })
    );

    return this.commands.bind(command);
  }

  despawn(): void {
    this.commands.cancel(new Error('Актор деспавнен'));
  }

  /** Возвращает длительность анимации. Выбрасывает ошибку, если длительность не задана */
  private getAnimationDuration(animation: AnimationId): number {
    const info: Partial<VirtualAnimation> | undefined = this.animations[animation];

    if (info?.duration === undefined) {
      throw new Error(`Не задана длительность анимации ${animation}`);
    }

    return info.duration;
  }
}
