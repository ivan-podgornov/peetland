import type { IAnimationManager } from '@peetland/animation-manager';
import { AbortController } from '@peetland/events';
import type { IAbortSignal } from '@peetland/events';
import type { AnimationId, IActor, IActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import { VirtualAchieveAngleCommand } from './achieve-angle-command';
import type { VirtualAnimation } from './animations';
import { VirtualGoToCoordsCommand } from './go-to-coords-command';
import { VirtualPlayAnimationCommand } from './play-animation-command';

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
  /** Угол поворота в градусах, с которым появляется актор. Приводится к [0, 360) */
  angle: number;
};

export type VirtualActorDeps = {
  /** Менеджер анимаций. Один на всех акторов */
  animations: IAnimationManager<VirtualAnimation>;
  geometry: IGeometry;
  timer: ITimer;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor implements IActor {
  private readonly deps: VirtualActorDeps;
  private position: Vector3;
  private angle: number;
  private readonly despawnController: AbortController;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    this.deps = deps;
    this.position = { ...options.position };
    this.angle = deps.geometry.normalizeAngle(options.angle);
    this.despawnController = new AbortController();
  }

  get signal(): IAbortSignal {
    return this.despawnController.signal;
  }

  getPosition(): Vector3 {
    return { ...this.position };
  }

  getAngle(): number {
    return this.angle;
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  setAngle(angle: number): void {
    const { geometry } = this.deps;

    this.angle = geometry.normalizeAngle(angle);
  }

  achieveAngle(angle: number, tolerance: number): IActorCommand<number> {
    const { geometry, timer } = this.deps;

    return new VirtualAchieveAngleCommand(this, { angle, tolerance }, { geometry, timer });
  }

  goToCoords(coords: Vector3, completeRadius: number): IActorCommand<Vector3> {
    const { geometry, timer } = this.deps;

    return new VirtualGoToCoordsCommand(this, { coords, completeRadius }, { geometry, timer });
  }

  /**
   * Если время проигрывания не передано, анимация длится столько, сколько указано в таблице
   * менеджера анимаций. Выбрасывает ошибку, если параметры не подходят анимации (см.
   * IAnimationManager.resolve)
   * @inheritdoc
   */
  playAnimation(animation: AnimationId, playbackDuration?: number): IActorCommand<void> {
    const { animations, timer } = this.deps;

    return new VirtualPlayAnimationCommand(
      this,
      { animation, playbackDuration },
      { animations, timer }
    );
  }

  despawn(): void {
    this.despawnController.abort(new Error('Актор деспавнен'));
  }
}
