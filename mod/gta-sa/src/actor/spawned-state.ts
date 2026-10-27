import type { ISubscriber } from '@peetland/events';
import type { GoToCoordsOptions, IActor, IActorCommand, IActorState } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import {
  deleteChar,
  doesCharExist,
  getCharCoordinates,
  setCharCoordinates,
} from '@peetland/moonloader';

import type { IGtaObjectFactory } from '../object';

import { GtaGoToCoordsCommand } from './go-to-coords-command';

export type GtaSpawnedActorStateDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
};

/** Состояние персонажа, который есть в игре */
export class GtaSpawnedActorState implements IActorState {
  private readonly handle: PedHandle;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;

  constructor(handle: PedHandle, deps: GtaSpawnedActorStateDeps) {
    this.handle = handle;
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
  }

  getPosition(): Vector3 {
    const [x, y, z] = getCharCoordinates(this.handle);

    return { x, y, z };
  }

  setPosition(position: Vector3): void {
    setCharCoordinates(this.handle, position.x, position.y, position.z);
  }

  createGoToCoordsCommand(
    actor: IActor,
    subscriber: ISubscriber<Vector3>,
    options: GoToCoordsOptions
  ): IActorCommand {
    return new GtaGoToCoordsCommand(actor, this.handle, subscriber, options, {
      geometry: this.geometry,
      objectFactory: this.objectFactory,
    });
  }

  despawn(): void {
    if (doesCharExist(this.handle)) {
      deleteChar(this.handle);
    }
  }
}
