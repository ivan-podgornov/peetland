import type { IGeometry } from '@peetland/geometry';
import type { Interval } from '@peetland/timings';

import { DespawnableActor } from '../actor';
import type { CreateActorOptions, IActorFactory } from '../actor';

import { VirtualActor } from './actor';

export type VirtualActorFactoryDeps = {
  geometry: IGeometry;
  /** Интервал, на каждое значение которого акторы делают шаг к точке */
  interval: Interval;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly geometry: IGeometry;
  private readonly interval: Interval;

  constructor(deps: VirtualActorFactoryDeps) {
    this.geometry = deps.geometry;
    this.interval = deps.interval;
  }

  create(options: CreateActorOptions): DespawnableActor {
    const actor = new VirtualActor(
      { position: options.position },
      { geometry: this.geometry, interval: this.interval }
    );

    return new DespawnableActor(actor);
  }
}
