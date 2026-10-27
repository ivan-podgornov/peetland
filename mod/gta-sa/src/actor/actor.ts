import type { ISubscriber } from '@peetland/events';
import { Actor } from '@peetland/game';
import type { CreateActorOptions, IActor, IActorCommand } from '@peetland/game';
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

import type { IGtaObjectFactory } from '../object';

import { GtaGoToCoordsCommand } from './go-to-coords-command';

export type ActorDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
};

export interface IGtaActor extends IActor {
  readonly handle: PedHandle;
}

export class GtaActor extends Actor implements IGtaActor {
  readonly handle: PedHandle;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly geometry: IGeometry;

  constructor(options: CreateActorOptions, deps: ActorDeps) {
    super();
    requestModel(options.modelId);
    loadAllModelsNow();

    const { x, y, z } = options.position;
    this.handle = createChar(4, options.modelId, x, y, z);
    dontRemoveChar(this.handle);
    markModelAsNoLongerNeeded(options.modelId);

    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
  }

  protected readPosition(): Vector3 {
    const [x, y, z] = getCharCoordinates(this.handle);

    return { x, y, z };
  }

  protected writePosition(position: Vector3): void {
    setCharCoordinates(this.handle, position.x, position.y, position.z);
  }

  protected createGoToCoordsCommand(
    subscriber: ISubscriber<Vector3>,
    coords: Vector3,
    completeRadius: number
  ): IActorCommand {
    return new GtaGoToCoordsCommand({
      actor: this,
      subscriber,
      geometry: this.geometry,
      objectFactory: this.objectFactory,
      coords,
      completeRadius,
    });
  }

  protected override onDespawn(): void {
    if (doesCharExist(this.handle)) {
      deleteChar(this.handle);
    }
  }
}
