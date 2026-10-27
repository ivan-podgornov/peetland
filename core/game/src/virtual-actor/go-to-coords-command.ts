import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { GoToCoordsOptions, IActor, IActorCommand } from '../actor';

/** Как часто виртуальный актор делает шаг к точке, в миллисекундах */
const STEP_INTERVAL = 1000;

/** Скорость пешехода: 5 км/ч в метрах в секунду */
const WALKING_SPEED = 5 / 3.6;

export type VirtualGoToCoordsCommandDeps = {
  geometry: IGeometry;
};

/** Раз в секунду двигает виртуального актора к точке по прямой */
export class VirtualGoToCoordsCommand implements IActorCommand {
  private readonly actor: IActor;
  private readonly subscriber: ISubscriber<Vector3>;
  private readonly options: GoToCoordsOptions;
  private readonly geometry: IGeometry;

  constructor(
    actor: IActor,
    subscriber: ISubscriber<Vector3>,
    options: GoToCoordsOptions,
    deps: VirtualGoToCoordsCommandDeps
  ) {
    this.actor = actor;
    this.subscriber = subscriber;
    this.options = options;
    this.geometry = deps.geometry;
  }

  start(): void {
    if (this.tryArrive()) {
      return;
    }

    const intervalId = setInterval(() => {
      const position = this.geometry.moveTowards(
        this.actor.getPosition(),
        this.options.coords,
        this.getSpeed()
      );

      this.actor.setPosition(position);
      this.tryArrive();
    }, STEP_INTERVAL);

    this.subscriber.addTeardown(() => clearInterval(intervalId));
  }

  stop(): void {
    this.subscriber.complete();
  }

  cancel(reason: unknown): void {
    this.subscriber.error(reason);
  }

  /** Возвращает скорость актора в метрах в секунду */
  private getSpeed(): number {
    return WALKING_SPEED;
  }

  /** Сообщает позицию актора и завершает команду, если он пришёл. Возвращает true, если пришёл */
  private tryArrive(): boolean {
    const { coords, completeRadius } = this.options;
    const position = this.actor.getPosition();
    this.subscriber.next(position);
    const arrived = this.geometry.isWithinRadius2d(position, coords, completeRadius);

    if (arrived) {
      this.stop();
    }

    return arrived;
  }
}
