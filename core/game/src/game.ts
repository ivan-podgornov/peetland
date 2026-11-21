import type { IAbortSignal, Observable } from '@peetland/events';
import type { IGeometry } from '@peetland/geometry';
import type { IReadonlyTime } from '@peetland/timings';

import type { IActor, IActorFactory } from './actor';
import type { IObjectFactory } from './object';

/** События игры, например, тик мира */
export type GameEvents = {
  /** Тик мира */
  tick: [];
};

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

  /**
   * Возвращает акторов, которых видит target в радиусе radius: в секторе его зрения и без
   * препятствий на прямой между ними. Сам target и деспавненные акторы не возвращаются
   */
  getVisibleActors(target: IActor, radius: number): IActor[];
}
