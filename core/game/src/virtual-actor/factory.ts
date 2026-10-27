import type { IGeometry } from '@peetland/geometry';

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

  create(options: CreateActorOptions): VirtualActor {
    return new VirtualActor({ position: options.position }, { geometry: this.geometry });
  }
}
