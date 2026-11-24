import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector3 } from '../src';

describe('Geometry', () => {
  describe('#isWithinRadius3d', () => {
    it('Если точка ближе радиуса, возвращает true', () => {
      const center: Vector3 = Geometry.vector3(0, 0, 0);
      const point: Vector3 = Geometry.vector3(1, 1, 1);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius3d(point, center, 5);

      expect(inRadius).toBe(true);
    });

    it('Если точка дальше радиуса, возвращает false', () => {
      const center: Vector3 = Geometry.vector3(0, 0, 0);
      const point: Vector3 = Geometry.vector3(10, 0, 0);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius3d(point, center, 5);

      expect(inRadius).toBe(false);
    });

    it('Если точка ровно на границе радиуса, возвращает true', () => {
      const center: Vector3 = Geometry.vector3(0, 0, 0);
      const point: Vector3 = Geometry.vector3(3, 4, 0);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius3d(point, center, 5);

      expect(inRadius).toBe(true);
    });

    it('Если точки совпадают и радиус равен 0, возвращает true', () => {
      const point: Vector3 = Geometry.vector3(3, 4, 0);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius3d(point, point, 0);

      expect(inRadius).toBe(true);
    });

    it('Если точка в радиусе на плоскости, но далеко по высоте, возвращает false', () => {
      const center: Vector3 = Geometry.vector3(0, 0, 0);
      const point: Vector3 = Geometry.vector3(1, 1, 50);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius3d(point, center, 5);

      expect(inRadius).toBe(false);
    });
  });
});
