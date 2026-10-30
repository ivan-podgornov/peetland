import type { IAnimationManager } from '@peetland/animation-manager';
import { AbortController } from '@peetland/events';
import type { IAbortSignal } from '@peetland/events';
import type { AnimationId, IActor, IActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import type { VirtualAnimation } from './animations';
import { VirtualGoToCoordsCommand } from './go-to-coords-command';
import { VirtualPlayAnimationCommand } from './play-animation-command';

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
};

export type VirtualActorDeps = {
  /** Менеджер анимаций. Один на всех акторов */
  animations: IAnimationManager<VirtualAnimation>;
  geometry: IGeometry;
  timer: ITimer;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor implements IActor {
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;
  private readonly animations: IAnimationManager<VirtualAnimation>;
  private position: Vector3;
  private readonly despawnController: AbortController;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    this.geometry = deps.geometry;
    this.timer = deps.timer;
    this.animations = deps.animations;
    this.position = { ...options.position };
    this.despawnController = new AbortController();
  }

  get signal(): IAbortSignal {
    return this.despawnController.signal;
  }

  getPosition(): Vector3 {
    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  goToCoords(coords: Vector3, completeRadius: number): IActorCommand<Vector3> {
    return new VirtualGoToCoordsCommand(
      this,
      { coords, completeRadius },
      { geometry: this.geometry, timer: this.timer }
    );
  }

  /**
   * Если время проигрывания не передано, анимация длится столько, сколько указано в таблице
   * менеджера анимаций. Выбрасывает ошибку, если параметры не подходят анимации (см.
   * IAnimationManager.resolve)
   * @inheritdoc
   */
  playAnimation(animation: AnimationId, playbackDuration?: number): IActorCommand<void> {
    return new VirtualPlayAnimationCommand(
      this,
      { animation, playbackDuration },
      { animations: this.animations, timer: this.timer }
    );
  }

  despawn(): void {
    this.despawnController.abort(new Error('Актор деспавнен'));
  }
}
