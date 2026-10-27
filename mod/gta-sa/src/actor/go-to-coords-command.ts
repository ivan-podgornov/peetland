import type { ISubscriber } from '@peetland/events';
import type { GoToCoordsOptions, IActor, IActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import { clearCharTasksImmediately, taskGoToObject } from '@peetland/moonloader';

import type { Interval } from '@peetland/timings';

import type { IGtaObjectFactory } from '../object';

export type GtaGoToCoordsCommandDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
  /** Интервал, на каждое значение которого команда проверяет, пришёл ли персонаж */
  interval: Interval;
};

/** Ведёт игрового персонажа к точке и на каждое значение интервала сообщает его позицию */
export class GtaGoToCoordsCommand implements IActorCommand {
  private readonly actor: IActor;
  private readonly handle: PedHandle;
  private readonly subscriber: ISubscriber<Vector3>;
  private readonly options: GoToCoordsOptions;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly interval: Interval;

  constructor(
    actor: IActor,
    handle: PedHandle,
    subscriber: ISubscriber<Vector3>,
    options: GoToCoordsOptions,
    deps: GtaGoToCoordsCommandDeps
  ) {
    this.actor = actor;
    this.handle = handle;
    this.subscriber = subscriber;
    this.options = options;
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
    this.interval = deps.interval;
  }

  start(): void {
    if (this.tryArrive()) {
      return;
    }

    const target = this.objectFactory.create({
      modelId: 3283, // Id модели конуса
      position: this.options.coords,
    });

    target.freeze();
    target.setVisibility(false);
    target.setCollisionEnabled(false);

    this.subscriber.addTeardown(() => {
      target.remove();
      clearCharTasksImmediately(this.handle);
    });

    taskGoToObject(this.handle, target.handle, -1, this.options.completeRadius);
    this.interval.subscribe(() => this.tryArrive(), { signal: this.subscriber.signal });
  }

  stop(): void {
    this.subscriber.complete();
  }

  cancel(reason: unknown): void {
    this.subscriber.error(reason);
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
