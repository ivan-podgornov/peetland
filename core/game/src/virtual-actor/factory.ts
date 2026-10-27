import type { IGeometry } from '@peetland/geometry';

import type { CreateActorOptions, IActorFactory } from '../actor';

import { VirtualActor } from './actor';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
const WALKING_SPEED = 5 / 3.6;

export type VirtualActorFactoryDeps = {
  geometry: IGeometry;
};

export type VirtualActorFactoryOptions = {
  /** Скорость движения акторов в метрах в секунду. По умолчанию скорость пешехода */
  speed?: number;
};

export class VirtualActorFactory implements IActorFactory {
  private readonly geometry: IGeometry;
  private readonly speed: number;

  constructor(deps: VirtualActorFactoryDeps, options: VirtualActorFactoryOptions = {}) {
    this.geometry = deps.geometry;
    this.speed = options.speed ?? WALKING_SPEED;
  }

  create(options: CreateActorOptions): VirtualActor {
    return new VirtualActor(
      { position: options.position, speed: this.speed },
      { geometry: this.geometry }
    );
  }
}
