import type { IGeometry } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import { DespawnableActor } from '../actor';
import type { CreateActorOptions, IActorFactory } from '../actor';

import { VirtualActor } from './actor';
import type { AnimationDurations } from './actor';

export type VirtualActorFactoryOptions = {
  /** Длительности анимаций для всех создаваемых акторов */
  animationDurations?: AnimationDurations;
};

export type VirtualActorFactoryDeps = {
  geometry: IGeometry;
  timer: ITimer;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly animationDurations: AnimationDurations;
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;

  constructor(options: VirtualActorFactoryOptions, deps: VirtualActorFactoryDeps) {
    this.animationDurations = { ...options.animationDurations };
    this.geometry = deps.geometry;
    this.timer = deps.timer;
  }

  create(options: CreateActorOptions): DespawnableActor {
    const actor = new VirtualActor(
      { position: options.position, animationDurations: this.animationDurations },
      { geometry: this.geometry, timer: this.timer }
    );

    return new DespawnableActor(actor);
  }
}
