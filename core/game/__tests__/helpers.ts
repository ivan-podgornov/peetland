import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { VirtualActor } from '../src';
import type { AnimationDurations } from '../src';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
export const WALKING_SPEED = 5 / 3.6;

type CreateActorOptions = {
  position?: Vector3;
  timer?: ITimer;
  animationDurations?: AnimationDurations;
};

/**
 * Создаёт виртуального актора. Если позиция не указана, актор появляется в начале координат.
 * Если таймер не указан, время для актора не идёт. Если длительности анимаций не указаны, все
 * анимации длятся по умолчанию
 */
export function createActor(options: CreateActorOptions = {}): VirtualActor {
  return new VirtualActor(
    {
      position: options.position ?? { x: 0, y: 0, z: 0 },
      animationDurations: options.animationDurations ?? {},
    },
    { geometry: new Geometry(), timer: options.timer ?? new ManualTimer() }
  );
}
