import type { ActorRegistry, CreateActorOptions, IActorFactory } from '@peetland/game';

import { GtaActor } from './actor';
import type { ActorDeps } from './actor';

export type ActorFactoryDeps = ActorDeps & {
  /** Общий реестр акторов, куда фабрика добавляет каждого созданного актора */
  actorRegistry: ActorRegistry;
};

export class GtaActorFactory implements IActorFactory {
  private readonly deps: ActorFactoryDeps;

  constructor(deps: ActorFactoryDeps) {
    this.deps = deps;
  }

  create(options: CreateActorOptions): GtaActor {
    const { actorRegistry } = this.deps;
    const actor = new GtaActor(options, this.deps);

    actorRegistry.register(actor);

    return actor;
  }
}
