import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { ManualIntervalObservable } from '@peetland/timings';
import type { Interval } from '@peetland/timings';

import { VirtualActor } from '../src';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
export const WALKING_SPEED = 5 / 3.6;

type CreateActorOptions = {
  position?: Vector3;
  interval?: Interval;
};

/**
 * Создаёт виртуального актора. Если позиция не указана, актор появляется в начале координат.
 * Если интервал не указан, время для актора не идёт
 */
export function createActor(options: CreateActorOptions = {}): VirtualActor {
  return new VirtualActor(
    { position: options.position ?? { x: 0, y: 0, z: 0 } },
    { geometry: new Geometry(), interval: options.interval ?? new ManualIntervalObservable() }
  );
}
