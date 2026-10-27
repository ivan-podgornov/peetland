import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';

import { VirtualActor } from '../../src';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
export const WALKING_SPEED = 5 / 3.6;

/** Создаёт виртуального актора. Если позиция не указана, актор появляется в начале координат */
export function createActor(position: Vector3 = { x: 0, y: 0, z: 0 }): VirtualActor {
  return new VirtualActor({ position }, { geometry: new Geometry() });
}
