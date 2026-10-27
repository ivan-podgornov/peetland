import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { IActorCommand, IActorState } from '@peetland/game';
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
  private command: IActorCommand | null;

  constructor(handle: PedHandle, deps: GtaSpawnedActorStateDeps) {
    this.handle = handle;
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
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
        { geometry: this.geometry, objectFactory: this.objectFactory }
      );

      this.command?.cancel(new Error('Актор получил другую команду'));
      this.command = command;

      subscriber.addTeardown(() => {
        if (this.command === command) {
          this.command = null;
        }
      });

      command.start();
    });
  }

  despawn(): void {
    this.command?.cancel(new Error('Актор деспавнен'));

    if (doesCharExist(this.handle)) {
      deleteChar(this.handle);
    }
  }
}
