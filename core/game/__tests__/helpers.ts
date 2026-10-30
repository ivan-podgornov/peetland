import { Observable } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

import type { IActor, IActorCommand } from '../src';

/** Команда тестового актора, которая ничего не делает */
export class TestCommand implements IActorCommand {
  readonly name = 'test';

  start(): void {}

  stop(): void {}

  cancel(): void {}
}

/**
 * Актор, который только хранит позицию и текущую команду. goToCoords и playAnimation возвращают
 * Observable, который ничего не сообщает и не завершается
 */
export class TestActor implements IActor {
  currentCommand: IActorCommand | null = null;
  private position: Vector3 = { x: 0, y: 0, z: 0 };

  getPosition(): Vector3 {
    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  goToCoords(): Observable<Vector3> {
    return new Observable(() => {});
  }

  playAnimation(): Observable<void> {
    return new Observable(() => {});
  }

  despawn(): void {}
}

/** Создаёт тестового актора в начале координат */
export function createActor(): TestActor {
  return new TestActor();
}
