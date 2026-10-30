import type { ISubscriber } from '@peetland/events';
import type { GoToCoordsOptions, IActor, ILegacyActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import { clearCharTasksImmediately, taskGoToObject } from '@peetland/moonloader';

import type { ITimer } from '@peetland/timings';

import type { IGtaObjectFactory } from '../object';

export type GtaGoToCoordsCommandDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
  timer: ITimer;
};

/** Как часто команда проверяет, пришёл ли персонаж, в миллисекундах */
const CHECK_PERIOD = 1000;

/** Ведёт игрового персонажа к точке и раз в секунду сообщает его позицию */
export class GtaGoToCoordsCommand implements ILegacyActorCommand {
  readonly name = 'go-to-coords';
  private readonly actor: IActor;
  private readonly handle: PedHandle;
  private readonly subscriber: ISubscriber<Vector3>;
  private readonly options: GoToCoordsOptions;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly timer: ITimer;

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
    this.timer = deps.timer;
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

    taskGoToObject(this.handle, target.handle, -1, 0.1);
    this.timer
      .interval(CHECK_PERIOD)
      .subscribe(() => this.tryArrive(), { signal: this.subscriber.signal });
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
