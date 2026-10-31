import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector2, Vector3 } from '../src';

describe('Geometry', () => {
  describe('#getAngleTo', () => {
    it('Если цель по оси +X, возвращает 0', () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: 1, y: 0 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(0);
    });

    it('Если цель по оси +Y, возвращает 90', () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: 0, y: 1 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(90);
    });

    it('Если цель по оси −X, возвращает 180', () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: -1, y: 0 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(180);
    });

    it('Если цель по оси −Y, возвращает 270', () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: 0, y: -1 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(270);
    });

    it('Если цель между осями +X и +Y, возвращает 45', () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: 1, y: 1 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(45);
    });

    it('Если цель между осями +X и −Y, возвращает 315', () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: 1, y: -1 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(315);
    });

    it('Считает угол относительно точки from, а не начала координат', () => {
      const from: Vector2 = { x: 10, y: 10 };
      const to: Vector2 = { x: 10, y: 15 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(90);
    });

    it('Если точки совпадают, возвращает 0', () => {
      const point: Vector2 = { x: 3, y: 4 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(point, point);

      expect(angle).toBe(0);
    });

    it('Не учитывает высоту точек', () => {
      const from: Vector3 = { x: 0, y: 0, z: 0 };
      const to: Vector3 = { x: 0, y: 1, z: 50 };
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(90);
    });
  });
});
