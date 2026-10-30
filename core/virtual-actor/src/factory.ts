import { DespawnableActor } from '@peetland/game';
import type { CreateActorOptions, IActorFactory } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import { VirtualActor } from './actor';
import type { VirtualAnimations } from './play-animation-command';

export type VirtualActorFactoryOptions = {
  /** Анимации, которые умеют проигрывать создаваемые акторы */
  animations: VirtualAnimations;
};

export type VirtualActorFactoryDeps = {
  geometry: IGeometry;
  timer: ITimer;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly animations: VirtualAnimations;
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;

  constructor(options: VirtualActorFactoryOptions, deps: VirtualActorFactoryDeps) {
    this.animations = { ...options.animations };
    this.geometry = deps.geometry;
    this.timer = deps.timer;
  }

  create(options: CreateActorOptions): DespawnableActor {
    const actor = new VirtualActor(
      { position: options.position, animations: this.animations },
      { geometry: this.geometry, timer: this.timer }
    );

    return new DespawnableActor(actor);
  }
}
