import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ITimer } from '@peetland/timings';

import type { GoToCoordsOptions, IActor, IActorCommand } from '../actor';

/** Как часто актор делает шаг к точке, в миллисекундах */
const STEP_PERIOD = 1000;

/** Скорость пешехода: 5 км/ч в метрах в секунду */
const WALKING_SPEED = 5 / 3.6;

export type VirtualGoToCoordsCommandDeps = {
  geometry: IGeometry;
  timer: ITimer;
};

/** Раз в секунду двигает виртуального актора к точке по прямой */
export class VirtualGoToCoordsCommand implements IActorCommand {
  private readonly actor: IActor;
  private readonly subscriber: ISubscriber<Vector3>;
  private readonly options: GoToCoordsOptions;
  private readonly geometry: IGeometry;
  private readonly timer: ITimer;

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
    this.timer = deps.timer;
  }

  start(): void {
    if (this.tryArrive()) {
      return;
    }

    this.timer.interval(STEP_PERIOD).subscribe(
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
