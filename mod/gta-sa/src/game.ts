import { AnimationManager } from '@peetland/animation-manager';
import { EventTarget } from '@peetland/events';
import type { Observable } from '@peetland/events';
import type { IActorFactory, IGame } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { IGeometry } from '@peetland/geometry';
import { addEventHandler } from '@peetland/moonloader';
import { Timer } from '@peetland/timings';

import { GTA_ANIMATIONS, GtaActorFactory, GtaAnimationLoader } from './actor';

import { GtaObjectFactory } from './object';
import type { IGtaObjectFactory } from './object';

export class GtaGame implements IGame {
  readonly actorFactory: IActorFactory;
  readonly objectFactory: IGtaObjectFactory;
  readonly geometry: IGeometry;
  readonly frames: Observable<unknown>;

  constructor() {
    const timer = new Timer();
    // Обработчик событий MoonLoader снять нельзя, поэтому он один на игру, а подписчики кадров
    // подписываются и отписываются через EventTarget
    const frameEvents = new EventTarget<{ frame: [] }>();
    addEventHandler('onFrame', () => frameEvents.dispatchEvent('frame'));

    this.frames = frameEvents.when('frame');

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
}
