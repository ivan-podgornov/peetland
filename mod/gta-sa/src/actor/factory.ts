import { DespawnableActor } from '@peetland/game';
import type { CreateActorOptions, IActorFactory } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';

import type { Interval } from '@peetland/timings';

import type { IGtaObjectFactory } from '../object';

import { GtaActor } from './actor';
import type { ActorDeps } from './actor';

export type ActorFactoryDeps = ActorDeps;

export class GtaActorFactory implements IActorFactory {
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly interval: Interval;

  constructor(deps: ActorFactoryDeps) {
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
    this.interval = deps.interval;
  }

  create(options: CreateActorOptions): DespawnableActor {
    const actor = new GtaActor(options, {
      geometry: this.geometry,
      objectFactory: this.objectFactory,
      interval: this.interval,
    });

    return new DespawnableActor(actor);
  }
}
