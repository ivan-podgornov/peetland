import type { Observable } from '@peetland/events';
import type { IGeometry } from '@peetland/geometry';
import type { ITime } from '@peetland/timings';

import type { IActorFactory } from './actor';
import type { IObjectFactory } from './object';

export interface IGame {
  readonly actorFactory: IActorFactory;
  /** Время суток в игре */
  readonly time: ITime;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
  /** Сообщает о каждом кадре игры */
  readonly frames: Observable<unknown>;
}
