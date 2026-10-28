import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { AnimationId, CreateActorOptions, IActor, IActorCommand } from '@peetland/game';
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

import { GTA_ANIMATIONS } from './animations';
import { GtaGoToCoordsCommand } from './go-to-coords-command';
import { GtaPlayAnimationCommand } from './play-animation-command';

export type ActorDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
  timer: ITimer;
};

export class GtaActor implements IActor {
  private readonly handle: PedHandle;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly timer: ITimer;
  private command: IActorCommand | null;

  constructor(options: CreateActorOptions, deps: ActorDeps) {
    requestModel(options.modelId);
    loadAllModelsNow();

    const { x, y, z } = options.position;
    this.handle = createChar(4, options.modelId, x, y, z);
    dontRemoveChar(this.handle);
    markModelAsNoLongerNeeded(options.modelId);

    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
    this.timer = deps.timer;
    this.command = null;
  }

  get currentCommand(): IActorCommand | null {
    return this.command;
  }

  getPosition(): Vector3 {
    const [x, y, z] = getCharCoordinates(this.handle);

    return { x, y, z };
  }

  setPosition(position: Vector3): void {
    setCharCoordinates(this.handle, position.x, position.y, position.z);
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    return new Observable((subscriber: ISubscriber<Vector3>) => {
      const command = new GtaGoToCoordsCommand(
        this,
        this.handle,
        subscriber,
        { coords, completeRadius },
        { geometry: this.geometry, objectFactory: this.objectFactory, timer: this.timer }
      );

      this.execute(command, subscriber);
    });
  }

  playAnimation(animation: AnimationId): Observable<void> {
    return new Observable((subscriber: ISubscriber<void>) => {
      const command = new GtaPlayAnimationCommand(
        this.handle,
        subscriber,
        GTA_ANIMATIONS[animation],
        { timer: this.timer }
      );

      this.execute(command, subscriber);
    });
  }

  despawn(): void {
    this.command?.cancel(new Error('Актор деспавнен'));

    if (doesCharExist(this.handle)) {
      deleteChar(this.handle);
    }
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
