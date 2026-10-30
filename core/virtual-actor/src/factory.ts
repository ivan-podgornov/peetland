import type { CreateActorOptions, IActorFactory } from '@peetland/game';

import { VirtualActor } from './actor';
import type { VirtualActorDeps } from './actor';

export type VirtualActorFactoryDeps = VirtualActorDeps;

export class VirtualActorFactory implements IActorFactory {
  private readonly deps: VirtualActorFactoryDeps;

  constructor(deps: VirtualActorFactoryDeps) {
    this.deps = deps;
  }

  create(options: CreateActorOptions): VirtualActor {
    return new VirtualActor({ position: options.position }, this.deps);
  }
}
