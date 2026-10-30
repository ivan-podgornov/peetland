import { ActorCommandSlot } from '@peetland/game';
import type {
  AnimationId,
  CreateActorOptions,
  IActor,
  IActorCommand,
  IAnimationManager,
} from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import {
  createChar,
  deleteChar,
  doesCharExist,
  dontRemoveChar,
  getCharCoordinates,
  loadAllModelsNow,
  markModelAsNoLongerNeeded,
  requestModel,
  setCharCoordinates,
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
  private readonly animations: IAnimationManager<GtaAnimation>;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly timer: ITimer;
  private readonly commands: ActorCommandSlot;

  constructor(options: CreateActorOptions, deps: ActorDeps) {
    requestModel(options.modelId);
    loadAllModelsNow();

    const { x, y, z } = options.position;
    this.handle = createChar(4, options.modelId, x, y, z);
    dontRemoveChar(this.handle);
    markModelAsNoLongerNeeded(options.modelId);

    this.animations = deps.animations;
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
    this.timer = deps.timer;
    this.commands = new ActorCommandSlot();
  }

  getPosition(): Vector3 {
    const [x, y, z] = getCharCoordinates(this.handle);

    return { x, y, z };
  }

  setPosition(position: Vector3): void {
    setCharCoordinates(this.handle, position.x, position.y, position.z);
  }

  goToCoords(coords: Vector3, completeRadius: number): IActorCommand<Vector3> {
    const command = new GtaGoToCoordsCommand(
      this,
      { handle: this.handle, coords, completeRadius },
      { geometry: this.geometry, objectFactory: this.objectFactory, timer: this.timer }
    );

    return this.commands.bind(command);
  }

  /**
   * Если время проигрывания не передано, анимация длится столько, сколько указано в таблице
   * менеджера анимаций
   * @inheritdoc
   */
  playAnimation(animation: AnimationId, playbackDuration?: number): IActorCommand<void> {
    const command = new GtaPlayAnimationCommand(
      this,
      { handle: this.handle, animation, playbackDuration },
      { animations: this.animations, timer: this.timer }
    );

    return this.commands.bind(command);
  }

  despawn(): void {
    this.commands.cancel(new Error('Актор деспавнен'));

    if (doesCharExist(this.handle)) {
      deleteChar(this.handle);
    }
  }
}
