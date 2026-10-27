import type { ISubscriber } from '@peetland/events';
import type { GoToCoordsOptions, IActorCommand } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import {
  clearCharTasksImmediately,
  getCharCoordinates,
  taskGoToObject,
} from '@peetland/moonloader';

import type { IGtaObjectFactory } from '../object';

export type GtaGoToCoordsCommandDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
};

/** Ведёт игрового персонажа к точке и раз в секунду сообщает его позицию */
export class GtaGoToCoordsCommand implements IActorCommand {
  private readonly handle: PedHandle;
  private readonly subscriber: ISubscriber<Vector3>;
  private readonly options: GoToCoordsOptions;
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;

  constructor(
    handle: PedHandle,
    subscriber: ISubscriber<Vector3>,
    options: GoToCoordsOptions,
    deps: GtaGoToCoordsCommandDeps
  ) {
    this.handle = handle;
    this.subscriber = subscriber;
    this.options = options;
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
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
    const intervalId = setInterval(() => this.tryArrive(), 1000);
    this.subscriber.addTeardown(() => clearInterval(intervalId));
  }

  stop(): void {
    this.subscriber.complete();
  }

  cancel(reason: unknown): void {
    this.subscriber.error(reason);
  }

  /** Сообщает позицию персонажа и завершает команду, если он пришёл. Возвращает true, если пришёл */
  private tryArrive(): boolean {
    const { coords, completeRadius } = this.options;
    const [x, y, z] = getCharCoordinates(this.handle);
    const position = { x, y, z };
    this.subscriber.next(position);
    const arrived = this.geometry.isWithinRadius2d(position, coords, completeRadius);

    if (arrived) {
      this.stop();
    }

    return arrived;
  }
}
