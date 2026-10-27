import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';

import { Actor } from '../actor';
import type { IActorCommand } from '../actor';

import { VirtualGoToCoordsCommand } from './go-to-coords-command';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
const WALKING_SPEED = 5 / 3.6;

export type VirtualActorDeps = {
  geometry: IGeometry;
};

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor extends Actor {
  private readonly geometry: IGeometry;
  private position: Vector3;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    super();
    this.geometry = deps.geometry;
    this.position = { ...options.position };
  }

  protected readPosition(): Vector3 {
    return { ...this.position };
  }

  protected writePosition(position: Vector3): void {
    this.position = { ...position };
  }

  protected createGoToCoordsCommand(
    subscriber: ISubscriber<Vector3>,
    coords: Vector3,
    completeRadius: number
  ): IActorCommand {
    return new VirtualGoToCoordsCommand({
      actor: this,
      subscriber,
      geometry: this.geometry,
      coords,
      completeRadius,
      speed: WALKING_SPEED,
    });
  }
}
