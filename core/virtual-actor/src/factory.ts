import type { IAnimationManager } from '@peetland/animation-manager';
import type { CreateActorOptions, IActorFactory } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import { VirtualActor } from './actor';
import type { VirtualAnimation } from './animations';

export type VirtualActorFactoryDeps = {
  /** Менеджер анимаций, общий для всех создаваемых акторов */
  animations: IAnimationManager<VirtualAnimation>;
  geometry: IGeometry;
  timer: ITimer;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly animations: IAnimationManager<VirtualAnimation>;
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;

  constructor(deps: VirtualActorFactoryDeps) {
    this.animations = deps.animations;
    this.geometry = deps.geometry;
    this.timer = deps.timer;
  }

  create(options: CreateActorOptions): VirtualActor {
    return new VirtualActor(
      { position: options.position },
      { animations: this.animations, geometry: this.geometry, timer: this.timer }
    );
  }
}
