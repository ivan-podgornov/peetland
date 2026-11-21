import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Sector2d, Vector2 } from '../src';

function point(x: number, y: number): Vector2 {
  return {
    x,
    y,
  };
}

function sector(angle: number, fovDeg: number, origin: Vector2 = point(0, 0)): Sector2d {
  return {
    origin,
    angle,
    fovDeg,
  };
}

describe('Geometry', () => {
  describe('#isPointInSector2d', () => {
    it('Возвращает true, если точка в направлении сектора', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(0, 90), point(0, 10))).toBe(true);
    });

    it('Возвращает false, если точка в противоположном сектору направлении', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(0, 90), point(0, -10))).toBe(false);
    });

    it('Возвращает true, если точка ровно на крайнем угле сектора', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(0, 90), point(-10, 10))).toBe(true); // 45°
      expect(geometry.isPointInSector2d(sector(0, 90), point(10, 10))).toBe(true); // 315°
    });

    it('Возвращает false, если точка за крайними углами сектора', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(0, 60), point(-10, 10))).toBe(false); // 45° > 30°
    });

    it('Возвращает true для точки в любом направлении, если угловой размер 360°', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(0, 360), point(0, -10))).toBe(true);
      expect(geometry.isPointInSector2d(sector(0, 360), point(10, 0))).toBe(true);
    });

    it('Возвращает true для крайних углов сектора, пересекающего границу 0° и 360°', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(315, 90), point(0, 10))).toBe(true); // 0°
      expect(geometry.isPointInSector2d(sector(315, 90), point(10, 0))).toBe(true); // 270°
    });

    it('Возвращает false для точки вне сектора, пересекающего границу 0° и 360°', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(315, 90), point(10, -10))).toBe(false); // 225°
    });

    it('Возвращает true, если точка в вершине сектора', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(0, 90, point(100, 200)), point(100, 200))).toBe(
        true
      );
    });

    it('Считает направление от вершины сектора, а не от начала координат', () => {
      const geometry = new Geometry();
      const origin = point(100, 200);

      expect(geometry.isPointInSector2d(sector(0, 90, origin), point(100, 210))).toBe(true);
      expect(geometry.isPointInSector2d(sector(0, 90, origin), point(100, 190))).toBe(false);
    });

    it('Возвращает true для точки на любом расстоянии, потому что радиус не проверяется', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(0, 90), point(0, 100000))).toBe(true);
    });

    it('Приводит отрицательный угол сектора к диапазону [0, 360)', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(-10, 30), point(0, 10))).toBe(true); // 0° внутри
    });

    it('Возвращает true только для точки ровно в направлении сектора при угловом размере 0°', () => {
      const geometry = new Geometry();

      expect(geometry.isPointInSector2d(sector(90, 0), point(-10, 0))).toBe(true); // ровно 90°
      expect(geometry.isPointInSector2d(sector(90, 0), point(0, 10))).toBe(false); // 0°
    });
  });
});
