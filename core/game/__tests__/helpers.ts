import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

import type { IActor, IActorCommand } from '../src';

/** Команда тестового актора, которая ничего не сообщает и не завершается */
export class TestCommand<TValue = unknown> implements IActorCommand<TValue> {
  readonly name = 'test';

  execute(): Observable<TValue> {
    return new Observable(() => {});
  }

  cancel(): void {}
}

/**
 * Актор, который только хранит позицию. goToCoords и playAnimation возвращают
 * команду, которая ничего не сообщает и не завершается
 */
export class TestActor implements IActor {
  private position: Vector3 = { x: 0, y: 0, z: 0 };

  getPosition(): Vector3 {
    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  goToCoords(): IActorCommand<Vector3> {
    return new TestCommand();
  }

  playAnimation(): IActorCommand<void> {
    return new TestCommand();
  }

  despawn(): void {}
}

/** Создаёт тестового актора в начале координат */
export function createActor(): TestActor {
  return new TestActor();
}

/** Команда, которую завершает тест. cancel завершает её Observable ошибкой reason */
export class ManualCommand<TValue = unknown> implements IActorCommand<TValue> {
  readonly name = 'manual';
  /** Подписчик Observable команды. null, пока на него не подписались */
  subscriber: ISubscriber<TValue> | null = null;

  execute(): Observable<TValue> {
    return new Observable((subscriber: ISubscriber<TValue>) => {
      this.subscriber = subscriber;
    });
  }

  cancel(reason: unknown): void {
    this.subscriber?.error(reason);
  }
}
