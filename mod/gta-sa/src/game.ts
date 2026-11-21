import { AnimationManager } from '@peetland/animation-manager';
import { AbortController, EventTarget } from '@peetland/events';
import type { IAbortSignal, Observable } from '@peetland/events';
import { ActorRegistry } from '@peetland/game';
import type { IActorFactory, IGame } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { IGeometry } from '@peetland/geometry';
import type { ILogger } from '@peetland/logger';
import { addEventHandler, thisScript } from '@peetland/moonloader';
import { Timer } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import { GTA_ANIMATIONS, GtaActorFactory, GtaAnimationLoader } from './actor';
import { GtaClock } from './clock';

import { GtaLogger } from './logger';
import { GtaObjectFactory } from './object';
import type { IGtaObjectFactory } from './object';
import { GtaTime } from './time';

/** Как часто игра сообщает о тике мира, в миллисекундах */
const TICK_PERIOD = 250;

export type GtaGameDeps = {
  /** Куда игра и её акторы пишут лог. По умолчанию — GtaLogger */
  logger?: ILogger;
};

/**
 * Игра GTA SA. Тики мира идут по таймеру раз в TICK_PERIOD миллисекунд, поэтому, пока игра на паузе
 * или ещё не загружена, тиков нет: таймеры в это время не срабатывают
 */
export class GtaGame implements IGame {
  readonly actorFactory: IActorFactory;
  readonly time: IReadonlyTime;
  readonly objectFactory: IGtaObjectFactory;
  readonly geometry: IGeometry;
  readonly ticks: Observable<unknown>;

  private readonly terminateController: AbortController;

  constructor(deps: GtaGameDeps = {}) {
    const logger = deps.logger ?? new GtaLogger();
    const timer = new Timer();
    this.terminateController = new AbortController();
    // Событие приходит при завершении любого скрипта, поэтому чужие скрипты пропускаем
    addEventHandler('onScriptTerminate', (script) => {
      if (script === thisScript()) {
        this.terminateController.abort(new Error('Скрипт выгружен'));
      }
    });

    const { signal } = this.terminateController;
    // Таймер один на игру, а подписчики тиков подписываются и отписываются через EventTarget. После
    // выгрузки скрипта тики заканчиваются
    const tickEvents = new EventTarget<{ tick: [] }>();
    timer.interval(TICK_PERIOD).subscribe(() => tickEvents.dispatchEvent('tick'), { signal });

    this.ticks = tickEvents.when('tick');

    // Сутки длятся час, а не 24 минуты: так NPC успевают за сутки и заработать, и отдохнуть
    new GtaClock({
      ticks: this.ticks,
      signal,
    }).start();
    this.time = new GtaTime({ ticks: this.ticks });
    this.geometry = new Geometry();
    this.objectFactory = new GtaObjectFactory();
    const actorRegistry = new ActorRegistry();
    this.actorFactory = new GtaActorFactory({
      actorRegistry,
      animations: new AnimationManager(
        { animations: GTA_ANIMATIONS },
        { loader: new GtaAnimationLoader({ timer }) }
      ),
      geometry: this.geometry,
      logger,
      objectFactory: this.objectFactory,
      timer,
    });
  }

  get signal(): IAbortSignal {
    return this.terminateController.signal;
  }
}
