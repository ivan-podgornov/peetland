import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector2, Vector3 } from '../src';

describe('Geometry', () => {
  describe('#isWithinRadius2d', () => {
    it('Если точка ближе радиуса, возвращает true', () => {
      const center: Vector2 = Geometry.vector2(0, 0);
      const point: Vector2 = Geometry.vector2(1, 1);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius2d(point, center, 5);

      expect(inRadius).toBe(true);
    });

    it('Если точка дальше радиуса, возвращает false', () => {
      const center: Vector2 = Geometry.vector2(0, 0);
      const point: Vector2 = Geometry.vector2(10, 0);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius2d(point, center, 5);

      expect(inRadius).toBe(false);
    });

    it('Если точка ровно на границе радиуса, возвращает true', () => {
      const center: Vector2 = Geometry.vector2(0, 0);
      const point: Vector2 = Geometry.vector2(3, 4);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius2d(point, center, 5);

      expect(inRadius).toBe(true);
    });

    it('Если точки совпадают и радиус равен 0, возвращает true', () => {
      const point: Vector2 = Geometry.vector2(3, 4);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius2d(point, point, 0);

      expect(inRadius).toBe(true);
    });

    it('Если точка в радиусе на плоскости, но далеко по высоте, возвращает true', () => {
      const center: Vector3 = Geometry.vector3(0, 0, 0);
      const point: Vector3 = Geometry.vector3(1, 1, 50);
      const geometry = new Geometry();

      const inRadius = geometry.isWithinRadius2d(point, center, 5);

      expect(inRadius).toBe(true);
    });
  });
});
