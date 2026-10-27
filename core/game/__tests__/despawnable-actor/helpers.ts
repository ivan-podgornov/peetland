import { Observable } from '@peetland/events';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { IActor } from '../../src';

/** Создаёт мок актора, которого оборачивает декоратор */
export function createActorMock(): Mocked<IActor> {
  return {
    currentCommand: null,
    getPosition: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    setPosition: vi.fn(),
    goToCoords: vi.fn(() => new Observable(() => {})),
    despawn: vi.fn(),
  };
}
