import { createAnimationManager } from '@peetland/animation-manager/dev';
import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { VIRTUAL_ANIMATIONS, VirtualActor } from '../src';
import type { VirtualAnimations } from '../src';

export type CreateActorOptions = {
  position?: Vector3;
  angle?: number;
  timer?: ITimer;
  animations?: VirtualAnimations;
};

/**
 * Создаёт виртуального актора с менеджером анимаций, у которого все анимации загружены сразу. Если
 * позиция не указана, актор появляется в начале координат. Если угол не указан, актор повёрнут на 0°. Если таймер не указан, время для актора
 * не идёт. Если анимации не указаны, используются VIRTUAL_ANIMATIONS
 */
export function createActor(options: CreateActorOptions = {}): VirtualActor {
  return new VirtualActor(
    { position: options.position ?? { x: 0, y: 0, z: 0 }, angle: options.angle ?? 0 },
    {
      animations: createAnimationManager(options.animations ?? VIRTUAL_ANIMATIONS),
      geometry: new Geometry(),
      timer: options.timer ?? new ManualTimer(),
    }
  );
}
