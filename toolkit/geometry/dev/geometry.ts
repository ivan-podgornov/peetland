import { vi } from 'vitest';

import type { IGeometry, Vector3 } from '../src';

/** Создаёт мок геометрии: проверки попадания возвращают true, а методы можно переопределить */
export function createMockedGeometry(overrides: Partial<IGeometry> = {}): IGeometry {
  return {
    getDistance2d: vi.fn(() => 0),
    getDistance3d: vi.fn(() => 0),
    isWithinRadius2d: vi.fn(() => true),
    isWithinRadius3d: vi.fn(() => true),
    moveTowards: vi.fn((_current: Vector3, target: Vector3) => ({
      ...target,
    })),
    normalizeAngle: vi.fn((angle: number) => angle),
    isWithinAngle: vi.fn(() => true),
    getAngleTo: vi.fn(() => 0),
    formatPoint: vi.fn(() => ''),
    isPointInSector2d: vi.fn(() => true),
    ...overrides,
  };
}
