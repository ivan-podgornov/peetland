import type { CreateActorOptions, IActorFactory } from '@peetland/game';

import { GtaActor } from './actor';
import type { ActorDeps } from './actor';

export type ActorFactoryDeps = ActorDeps;

export class GtaActorFactory implements IActorFactory {
  private readonly deps: ActorFactoryDeps;

  constructor(deps: ActorFactoryDeps) {
    this.deps = deps;
  }

  create(options: CreateActorOptions): GtaActor {
    return new GtaActor(options, this.deps);
  }
}
