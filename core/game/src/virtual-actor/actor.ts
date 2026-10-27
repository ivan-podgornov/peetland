import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { IActor } from '../actor';

/** Как часто виртуальный актор делает шаг к точке, в миллисекундах */
const STEP_INTERVAL = 1000;

export type VirtualActorDeps = {
  geometry: IGeometry;
};

export type VirtualActorOptions = {
  /** Позиция, на которой появляется актор */
  position: Vector3;
  /** Скорость движения в метрах в секунду */
  speed: number;
};

/** Актор, который работает без игры и хранит всё в памяти */
export class VirtualActor implements IActor {
  private readonly geometry: IGeometry;
  private readonly speed: number;
  private position: Vector3;
  /** Подписчик движения, которое актор выполняет сейчас */
  private movement: ISubscriber<Vector3> | null;
  private despawned: boolean;

  constructor(options: VirtualActorOptions, deps: VirtualActorDeps) {
    this.geometry = deps.geometry;
    this.speed = options.speed;
    this.position = { ...options.position };
    this.movement = null;
    this.despawned = false;
  }

  getPosition(): Vector3 {
    this.assertSpawned();

    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.assertSpawned();

    this.position = { ...position };
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    this.assertSpawned();

    return new Observable((subscriber: ISubscriber<Vector3>) => {
      this.movement?.error(new Error('Актор получил команду идти к другой точке'));

      /** Возвращает true, если актор прибыл в точку назначения */
      const tryArrive = (): boolean => {
        subscriber.next(this.getPosition());
        const withinRadius = this.geometry.isWithinRadius2d(this.position, coords, completeRadius);

        if (withinRadius) {
          subscriber.complete();
        }

        return withinRadius;
      };

      if (tryArrive()) {
        return;
      }

      this.movement = subscriber;
      const intervalId = setInterval(() => {
        this.position = this.geometry.moveTowards(this.position, coords, this.speed);
        tryArrive();
      }, STEP_INTERVAL);

      subscriber.addTeardown(() => {
        clearInterval(intervalId);

        if (this.movement === subscriber) {
          this.movement = null;
        }
      });
    });
  }

  despawn(): void {
    this.assertSpawned();

    this.despawned = true;
    this.movement?.error(new Error('Актор деспавнен'));
  }

  /** Выбрасывает ошибку, если актор уже деспавнен */
  private assertSpawned(): void {
    if (this.despawned) {
      throw new Error('Актор деспавнен');
    }
  }
}
