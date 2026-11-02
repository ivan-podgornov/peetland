import type { Observable } from '@peetland/events';
import type { IGeometry } from '@peetland/geometry';
import type { IClock } from '@peetland/timings';

import type { IActorFactory } from './actor';
import type { IObjectFactory } from './object';

export interface IGame {
  readonly actorFactory: IActorFactory;
  /** Игровые часы, которые показывают время суток в игре */
  readonly clock: IClock;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
  /** Сообщает о каждом кадре игры */
  readonly frames: Observable<unknown>;
}
