import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';

import { VirtualActor } from '../../src';

type CreateActorOptions = {
  position?: Vector3;
  speed?: number;
};

/** Создаёт виртуального актора. Незначимые для теста опции заполняются значениями по умолчанию */
export function createActor(options: CreateActorOptions = {}): VirtualActor {
  return new VirtualActor(
    { position: options.position ?? { x: 0, y: 0, z: 0 }, speed: options.speed ?? 1 },
    { geometry: new Geometry() }
  );
}
