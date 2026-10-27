import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { Interval } from '@peetland/timings';

import type { GoToCoordsOptions, IActor, IActorCommand } from '../actor';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
const WALKING_SPEED = 5 / 3.6;

export type VirtualGoToCoordsCommandDeps = {
  geometry: IGeometry;
  /** Интервал, на каждое значение которого актор делает шаг к точке */
  interval: Interval;
};

/** На каждое значение интервала двигает виртуального актора к точке по прямой */
export class VirtualGoToCoordsCommand implements IActorCommand {
  private readonly actor: IActor;
  private readonly subscriber: ISubscriber<Vector3>;
  private readonly options: GoToCoordsOptions;
  private readonly geometry: IGeometry;
  private readonly interval: Interval;

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
    this.interval = deps.interval;
  }

  start(): void {
    if (this.tryArrive()) {
      return;
    }

    this.interval.subscribe(
      (elapsed) => {
        const distance = (this.getSpeed() * elapsed) / 1000;
        const position = this.geometry.moveTowards(
          this.actor.getPosition(),
          this.options.coords,
          distance
        );

        this.actor.setPosition(position);
        this.tryArrive();
      },
      { signal: this.subscriber.signal }
    );
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
