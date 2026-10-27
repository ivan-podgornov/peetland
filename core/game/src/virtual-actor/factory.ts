import type { IGeometry } from '@peetland/geometry';

import { DespawnableActor } from '../actor';
import type { CreateActorOptions, IActorFactory } from '../actor';

import { VirtualActor } from './actor';

export type VirtualActorFactoryDeps = {
  geometry: IGeometry;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly geometry: IGeometry;

  constructor(deps: VirtualActorFactoryDeps) {
    this.geometry = deps.geometry;
  }

  create(options: CreateActorOptions): DespawnableActor {
    const actor = new VirtualActor({ position: options.position }, { geometry: this.geometry });

    return new DespawnableActor(actor);
  }
}
