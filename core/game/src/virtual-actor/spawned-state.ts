import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { GoToCoordsOptions, IActor, IActorCommand, IActorState } from '../actor';

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

  constructor(options: VirtualSpawnedActorStateOptions, deps: VirtualSpawnedActorStateDeps) {
    this.geometry = deps.geometry;
    this.position = { ...options.position };
  }

  getPosition(): Vector3 {
    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  createGoToCoordsCommand(
    actor: IActor,
    subscriber: ISubscriber<Vector3>,
    options: GoToCoordsOptions
  ): IActorCommand {
    return new VirtualGoToCoordsCommand(actor, subscriber, options, { geometry: this.geometry });
  }

  despawn(): void {
    return;
  }
}
