import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector3 } from '../src';

describe('Geometry', () => {
  describe('#formatPoint', () => {
    it('Возвращает координаты через запятую в порядке x, y, z', () => {
      const point: Vector3 = {
        x: 1,
        y: 2,
        z: 3,
      };
      const geometry = new Geometry();

      const formatted = geometry.formatPoint(point);

      expect(formatted).toBe('1.00, 2.00, 3.00');
    });

    it('Округляет координаты до двух знаков после запятой', () => {
      const point: Vector3 = {
        x: 1320.2234,
        y: 210.516,
        z: 19.5,
      };
      const geometry = new Geometry();

      const formatted = geometry.formatPoint(point);

      expect(formatted).toBe('1320.22, 210.52, 19.50');
    });

    it('Если координаты отрицательные, сохраняет знак', () => {
      const point: Vector3 = {
        x: -1.5,
        y: -2,
        z: -0.25,
      };
      const geometry = new Geometry();

      const formatted = geometry.formatPoint(point);

      expect(formatted).toBe('-1.50, -2.00, -0.25');
    });
  });
});
