import type { IAnimationManager } from '@peetland/animation-manager';
import { AbortController } from '@peetland/events';
import type { IAbortSignal } from '@peetland/events';
import type { AnimationId, CreateActorOptions, IActor, IActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import {
  createChar,
  deleteChar,
  doesCharExist,
  dontRemoveChar,
  getCharCoordinates,
  getCharHeading,
  loadAllModelsNow,
  markModelAsNoLongerNeeded,
  requestModel,
  setCharCoordinates,
  setCharHeading,
} from '@peetland/moonloader';

import type { ITimer } from '@peetland/timings';

import type { IGtaObjectFactory } from '../object';

import type { GtaAnimation } from './animations';
import { GtaGoToCoordsCommand } from './go-to-coords-command';
import { GtaPlayAnimationCommand } from './play-animation-command';

export type ActorDeps = {
  /** Менеджер анимаций. Один на всех акторов */
  animations: IAnimationManager<GtaAnimation>;
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
  timer: ITimer;
};

export class GtaActor implements IActor {
  private readonly handle: PedHandle;
  private readonly deps: ActorDeps;
  private readonly despawnController: AbortController;

  constructor(options: CreateActorOptions, deps: ActorDeps) {
    requestModel(options.modelId);
    loadAllModelsNow();

    const { x, y, z } = options.position;
    this.handle = createChar(4, options.modelId, x, y, z);
    setCharHeading(this.handle, deps.geometry.normalizeAngle(options.angle));
    dontRemoveChar(this.handle);
    markModelAsNoLongerNeeded(options.modelId);

    this.deps = deps;
    this.despawnController = new AbortController();
  }

  get signal(): IAbortSignal {
    return this.despawnController.signal;
  }

  getPosition(): Vector3 {
    const [x, y, z] = getCharCoordinates(this.handle);

    return { x, y, z };
  }

  getAngle(): number {
    const { geometry } = this.deps;

    return geometry.normalizeAngle(getCharHeading(this.handle));
  }

  setPosition(position: Vector3): void {
    setCharCoordinates(this.handle, position.x, position.y, position.z);
  }

  goToCoords(coords: Vector3, completeRadius: number): IActorCommand<Vector3> {
    const { geometry, objectFactory, timer } = this.deps;

    return new GtaGoToCoordsCommand(
      this,
      { handle: this.handle, coords, completeRadius },
      { geometry, objectFactory, timer }
    );
  }

  /**
   * Если время проигрывания не передано, анимация длится столько, сколько указано в таблице
   * менеджера анимаций
   * @inheritdoc
   */
  playAnimation(animation: AnimationId, playbackDuration?: number): IActorCommand<void> {
    const { animations, timer } = this.deps;

    return new GtaPlayAnimationCommand(
      this,
      { handle: this.handle, animation, playbackDuration },
      { animations, timer }
    );
  }

  despawn(): void {
    this.despawnController.abort(new Error('Актор деспавнен'));

    if (doesCharExist(this.handle)) {
      deleteChar(this.handle);
    }
  }
}
