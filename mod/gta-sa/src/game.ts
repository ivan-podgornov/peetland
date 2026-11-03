import { AnimationManager } from '@peetland/animation-manager';
import { AbortController, EventTarget } from '@peetland/events';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActorFactory, IGame } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { IGeometry } from '@peetland/geometry';
import { addEventHandler, isGamePaused, lua_thread, wait } from '@peetland/moonloader';
import { Timer } from '@peetland/timings';
import type { ITime } from '@peetland/timings';

import { GTA_ANIMATIONS, GtaActorFactory, GtaAnimationLoader } from './actor';

import { GtaObjectFactory } from './object';
import type { IGtaObjectFactory } from './object';
import { GtaTime } from './time';

/** Как часто игра сообщает о кадре, в миллисекундах */
const FRAME_PERIOD = 50;

export class GtaGame implements IGame {
  readonly actorFactory: IActorFactory;
  readonly time: ITime;
  readonly objectFactory: IGtaObjectFactory;
  readonly geometry: IGeometry;
  readonly frames: Observable<unknown>;

  private readonly terminateController: AbortController;

  constructor() {
    const timer = new Timer();
    this.terminateController = new AbortController();
    addEventHandler('onScriptTerminate', () => {
      this.terminateController.abort(new Error('Скрипт выгружен'));
    });

    const { signal } = this.terminateController;
    // Поток не остановить снаружи, поэтому он один на игру, а подписчики кадров подписываются и
    // отписываются через EventTarget. На паузе кадры не идут, а после выгрузки скрипта поток
    // заканчивается
    const frameEvents = new EventTarget<{ frame: [] }>();
    lua_thread.create(() => {
      while (!signal.aborted) {
        wait(FRAME_PERIOD);

        if (!signal.aborted && !isGamePaused()) {
          frameEvents.dispatchEvent('frame');
        }
      }
    });

    this.frames = frameEvents.when('frame');

    this.time = new GtaTime({ frames: this.frames });
    this.geometry = new Geometry();
    this.objectFactory = new GtaObjectFactory();
    this.actorFactory = new GtaActorFactory({
      animations: new AnimationManager(
        { animations: GTA_ANIMATIONS },
        { loader: new GtaAnimationLoader({ timer }) }
      ),
      geometry: this.geometry,
      objectFactory: this.objectFactory,
      timer,
    });
  }

  get signal(): IAbortSignal {
    return this.terminateController.signal;
  }
}
