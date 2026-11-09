import type { IAbortSignal, Observable } from '@peetland/events';
import type { IGeometry } from '@peetland/geometry';
import type { IReadonlyTime } from '@peetland/timings';

import type { IActorFactory } from './actor';
import type { IObjectFactory } from './object';

export interface IGame {
  readonly actorFactory: IActorFactory;
  /** Время суток в игре */
  readonly time: IReadonlyTime;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
  /** Сообщает о каждом тике мира */
  readonly ticks: Observable<unknown>;
  /**
   * Переходит в состояние aborted, когда скрипт выгружается. Кто что создал в игре, тот по этому
   * сигналу это и убирает
   */
  readonly signal: IAbortSignal;
}
