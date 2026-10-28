import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { VirtualActor } from '../src';
import type { VirtualAnimation, VirtualAnimations } from '../src';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
export const WALKING_SPEED = 5 / 3.6;

/** Длительность анимации, если тесту не важно, сколько она длится, в миллисекундах */
export const ANIMATION_DURATION = 1000;

function animation(): VirtualAnimation {
  return { duration: ANIMATION_DURATION };
}

/**
 * Создаёт новую таблицу анимаций, в которой каждая анимация длится ANIMATION_DURATION. Таблица
 * типизирована полностью, поэтому новая анимация без записи здесь не скомпилируется
 */
export function createAnimations(): VirtualAnimations {
  return {
    'trash-search-start': animation(),
    'trash-search': animation(),
    'trash-search-look-1': animation(),
    'trash-search-look-2': animation(),
    'trash-search-pocket': animation(),
    'trash-search-end': animation(),
    'beg-sitting': animation(),
    'item-give': animation(),
    'item-receive': animation(),
    pay: animation(),
    'drink-standing-1': animation(),
    'drink-standing-2': animation(),
  };
}

type CreateActorOptions = {
  position?: Vector3;
  timer?: ITimer;
  animations?: VirtualAnimations;
};

/**
 * Создаёт виртуального актора. Если позиция не указана, актор появляется в начале координат.
 * Если таймер не указан, время для актора не идёт. Если анимации не указаны, каждая анимация длится
 * ANIMATION_DURATION
 */
export function createActor(options: CreateActorOptions = {}): VirtualActor {
  return new VirtualActor(
    {
      position: options.position ?? { x: 0, y: 0, z: 0 },
      animations: options.animations ?? createAnimations(),
    },
    { geometry: new Geometry(), timer: options.timer ?? new ManualTimer() }
  );
}
