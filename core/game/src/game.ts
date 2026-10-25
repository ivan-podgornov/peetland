import type { IGeometry } from '@peetland/geometry';

import type { IActorFactory } from './actor';
import type { IObjectFactory } from './object';

export interface IGame {
  readonly actorFactory: IActorFactory;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
}
