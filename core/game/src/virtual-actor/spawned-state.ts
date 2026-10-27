import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { IActorCommand, IActorState } from '../actor';

import { VirtualGoToCoordsCommand } from './go-to-coords-command';

export type VirtualSpawnedActorStateOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
};

export type VirtualSpawnedActorStateDeps = {
  geometry: IGeometry;
};

/** Состояние заспавненного виртуального актора, который хранит всё в памяти */
export class VirtualSpawnedActorState implements IActorState {
  private readonly geometry: IGeometry;
  private position: Vector3;
  private command: IActorCommand | null;

  constructor(options: VirtualSpawnedActorStateOptions, deps: VirtualSpawnedActorStateDeps) {
    this.geometry = deps.geometry;
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
        { geometry: this.geometry }
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
  }
}
