import type { IGeometry, Vector3 } from '@peetland/geometry';

import { Actor } from '../actor';

import { VirtualSpawnedActorState } from './spawned-state';

export type VirtualActorDeps = {
  geometry: IGeometry;
};

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor extends Actor {
  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    super(new VirtualSpawnedActorState(options, deps));
  }
}
