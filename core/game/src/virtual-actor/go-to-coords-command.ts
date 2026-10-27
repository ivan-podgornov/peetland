import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';

import { ActorCommand } from '../actor';
import type { IActor } from '../actor';

/** Как часто виртуальный актор делает шаг к точке, в миллисекундах */
const STEP_INTERVAL = 1000;

export type VirtualGoToCoordsCommandOptions = {
  actor: IActor;
  subscriber: ISubscriber<Vector3>;
  geometry: IGeometry;
  coords: Vector3;
  completeRadius: number;
  /** Скорость движения в метрах в секунду */
  speed: number;
};

/** Раз в секунду двигает виртуального актора к точке по прямой */
export class VirtualGoToCoordsCommand extends ActorCommand<Vector3> {
  private readonly actor: IActor;
  private readonly geometry: IGeometry;
  private readonly coords: Vector3;
  private readonly completeRadius: number;
  private readonly speed: number;

  constructor(options: VirtualGoToCoordsCommandOptions) {
    super(options.subscriber);
    this.actor = options.actor;
    this.geometry = options.geometry;
    this.coords = options.coords;
    this.completeRadius = options.completeRadius;
    this.speed = options.speed;
  }

  start(): void {
    if (this.tryArrive()) {
      return;
    }

    const intervalId = setInterval(() => {
      const position = this.geometry.moveTowards(this.actor.getPosition(), this.coords, this.speed);
      this.actor.setPosition(position);
      this.tryArrive();
    }, STEP_INTERVAL);

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
