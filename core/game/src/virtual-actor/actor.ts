import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import type { IActor, IActorCommand } from '../actor';

import { VirtualGoToCoordsCommand } from './go-to-coords-command';

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
};

export type VirtualActorDeps = {
  geometry: IGeometry;
  timer: ITimer;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor implements IActor {
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;
  private position: Vector3;
  private command: IActorCommand | null;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    this.geometry = deps.geometry;
    this.timer = deps.timer;
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
        { geometry: this.geometry, timer: this.timer }
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
