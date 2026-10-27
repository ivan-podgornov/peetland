import type { ISubscriber } from '@peetland/events';
import { ActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import { clearCharTasksImmediately, taskGoToObject } from '@peetland/moonloader';

import type { IGtaObjectFactory } from '../object';

import type { IGtaActor } from './actor';

export type GtaGoToCoordsCommandOptions = {
  actor: IGtaActor;
  subscriber: ISubscriber<Vector3>;
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
  coords: Vector3;
  completeRadius: number;
};

/** Ведёт игрового персонажа к точке и раз в секунду сообщает его позицию */
export class GtaGoToCoordsCommand extends ActorCommand<Vector3> {
  private readonly actor: IGtaActor;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly coords: Vector3;
  private readonly completeRadius: number;

  constructor(options: GtaGoToCoordsCommandOptions) {
    super(options.subscriber);
    this.actor = options.actor;
    this.geometry = options.geometry;
    this.objectFactory = options.objectFactory;
    this.coords = options.coords;
    this.completeRadius = options.completeRadius;
  }

  start(): void {
    if (this.tryArrive()) {
      return;
    }

    const target = this.objectFactory.create({
      modelId: 3283, // Id модели конуса
      position: this.coords,
    });

    target.freeze();
    target.setVisibility(false);
    target.setCollisionEnabled(false);

    this.subscriber.addTeardown(() => {
      target.remove();
      clearCharTasksImmediately(this.actor.handle);
    });

    taskGoToObject(this.actor.handle, target.handle, -1, this.completeRadius);
    const intervalId = setInterval(() => this.tryArrive(), 1000);
    this.subscriber.addTeardown(() => clearInterval(intervalId));
  }

  /** Сообщает позицию актора и завершает команду, если он пришёл. Возвращает true, если пришёл */
  private tryArrive(): boolean {
    const position = this.actor.getPosition();
    this.subscriber.next(position);
    const arrived = this.geometry.isWithinRadius2d(position, this.coords, this.completeRadius);

    if (arrived) {
      this.stop();
    }

    return arrived;
  }
}
