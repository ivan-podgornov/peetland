import { DespawnableActor } from '@peetland/game';
import type { CreateActorOptions, IActorFactory, IAnimationManager } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';

import type { ITimer } from '@peetland/timings';

import type { IGtaObjectFactory } from '../object';

import { GtaActor } from './actor';
import type { ActorDeps } from './actor';
import type { GtaAnimation } from './animations';

export type ActorFactoryDeps = ActorDeps;

export class GtaActorFactory implements IActorFactory {
  private readonly animations: IAnimationManager<GtaAnimation>;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly timer: ITimer;

  constructor(deps: ActorFactoryDeps) {
    this.animations = deps.animations;
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
    this.timer = deps.timer;
  }

  create(options: CreateActorOptions): DespawnableActor {
    const actor = new GtaActor(options, {
      animations: this.animations,
      geometry: this.geometry,
      objectFactory: this.objectFactory,
      timer: this.timer,
    });

    return new DespawnableActor(actor);
  }
}
