import type { CreateObjectOptions, IObject } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';

/**
 * Объект виртуальной игры. Мир ничего не рисует и не считает физику, поэтому объект хранит только
 * позицию
 */
export class VirtualObject implements IObject {
  private position: Vector3;

  constructor(options: CreateObjectOptions) {
    this.position = { ...options.position };
  }

  freeze(): void {}

  setCollisionEnabled(): void {}

  getPosition(): Vector3 {
    return { ...this.position };
  }

  setPosition(position: Vector3): void {
    this.position = { ...position };
  }

  setVisibility(): void {}

  remove(): void {}
}
