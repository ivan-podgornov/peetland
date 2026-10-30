import { AnimationManager, InstantAnimationLoader } from '@peetland/animation-manager';
import type { IAnimationManager } from '@peetland/animation-manager';
import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { VIRTUAL_ANIMATIONS, VirtualActor } from '../src';
import type { VirtualAnimation, VirtualAnimations } from '../src';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
export const WALKING_SPEED = 5 / 3.6;

type CreateActorOptions = {
  position?: Vector3;
  timer?: ITimer;
  animations?: VirtualAnimations;
};

/**
 * Создаёт менеджер анимаций, у которого все анимации загружены сразу. Если таблица анимаций не
 * указана, используется VIRTUAL_ANIMATIONS
 */
export function createAnimationManager(
  animations: VirtualAnimations = VIRTUAL_ANIMATIONS
): IAnimationManager<VirtualAnimation> {
  return new AnimationManager({ animations }, { loader: new InstantAnimationLoader() });
}

/**
 * Создаёт виртуального актора. Если позиция не указана, актор появляется в начале координат.
 * Если таймер не указан, время для актора не идёт. Если анимации не указаны, используются
 * VIRTUAL_ANIMATIONS
 */
export function createActor(options: CreateActorOptions = {}): VirtualActor {
  return new VirtualActor(
    { position: options.position ?? { x: 0, y: 0, z: 0 } },
    {
      animations: createAnimationManager(options.animations),
      geometry: new Geometry(),
      timer: options.timer ?? new ManualTimer(),
    }
  );
}
