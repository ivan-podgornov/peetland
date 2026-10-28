import type { IGeometry } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import { DespawnableActor } from '../actor';
import type { CreateActorOptions, IActorFactory } from '../actor';

import { VirtualActor } from './actor';

export type VirtualActorFactoryDeps = {
  geometry: IGeometry;
  timer: ITimer;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;

  constructor(deps: VirtualActorFactoryDeps) {
    this.geometry = deps.geometry;
    this.timer = deps.timer;
  }

  create(options: CreateActorOptions): DespawnableActor {
    const actor = new VirtualActor(
      { position: options.position },
      { geometry: this.geometry, timer: this.timer }
    );

    return new DespawnableActor(actor);
  }
}
