import type { IActorFactory, IGame } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { IGeometry } from '@peetland/geometry';

import { GtaActorFactory } from './actor';

import { GtaObjectFactory } from './object';
import type { IGtaObjectFactory } from './object';

export class GtaGame implements IGame {
  readonly actorFactory: IActorFactory;
  readonly objectFactory: IGtaObjectFactory;
  readonly geometry: IGeometry;

  constructor() {
    this.geometry = new Geometry();
    this.objectFactory = new GtaObjectFactory();
    this.actorFactory = new GtaActorFactory({
      geometry: this.geometry,
      objectFactory: this.objectFactory,
    });
  }
}
