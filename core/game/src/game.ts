import type { Observable } from '@peetland/events';
import type { IGeometry } from '@peetland/geometry';

import type { IActorFactory } from './actor';
import type { IObjectFactory } from './object';

export interface IGame {
  readonly actorFactory: IActorFactory;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
  /** Сообщает о каждом кадре игры */
  readonly frames: Observable<unknown>;
}
