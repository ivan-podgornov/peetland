import type { CreateActorOptions, IActorFactory, IActorRegistry } from '@peetland/game';

import { VirtualActor } from './actor';
import type { VirtualActorDeps } from './actor';

export type VirtualActorFactoryDeps = VirtualActorDeps & {
  /** Общий реестр акторов игры */
  actorRegistry: IActorRegistry;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly deps: VirtualActorFactoryDeps;

  constructor(deps: VirtualActorFactoryDeps) {
    this.deps = deps;
  }

  create(options: CreateActorOptions): VirtualActor {
    const { actorRegistry } = this.deps;
    const actor = new VirtualActor(options, this.deps);

    actorRegistry.register(actor);

    return actor;
  }
}
