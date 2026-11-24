import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector2, Vector3 } from '../src';

describe('Geometry', () => {
  describe('#getAngleTo', () => {
    it('Если цель на севере (+Y), возвращает 0', () => {
      const from: Vector2 = Geometry.vector2(0, 0);
      const to: Vector2 = Geometry.vector2(0, 1);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(0);
    });

    it('Если цель на западе (−X), возвращает 90', () => {
      const from: Vector2 = Geometry.vector2(0, 0);
      const to: Vector2 = Geometry.vector2(-1, 0);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(90);
    });

    it('Если цель на юге (−Y), возвращает 180', () => {
      const from: Vector2 = Geometry.vector2(0, 0);
      const to: Vector2 = Geometry.vector2(0, -1);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(180);
    });

    it('Если цель на востоке (+X), возвращает 270', () => {
      const from: Vector2 = Geometry.vector2(0, 0);
      const to: Vector2 = Geometry.vector2(1, 0);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(270);
    });

    it('Если цель на северо-западе, возвращает 45', () => {
      const from: Vector2 = Geometry.vector2(0, 0);
      const to: Vector2 = Geometry.vector2(-1, 1);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(45);
    });

    it('Если цель на северо-востоке, возвращает 315', () => {
      const from: Vector2 = Geometry.vector2(0, 0);
      const to: Vector2 = Geometry.vector2(1, 1);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(315);
    });

    it('Считает угол относительно точки from, а не начала координат', () => {
      const from: Vector2 = Geometry.vector2(10, 10);
      const to: Vector2 = Geometry.vector2(5, 10);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(90);
    });

    it('Если точки совпадают, возвращает 0', () => {
      const point: Vector2 = Geometry.vector2(3, 4);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(point, point);

      expect(angle).toBe(0);
    });

    it('Не учитывает высоту точек', () => {
      const from: Vector3 = Geometry.vector3(0, 0, 0);
      const to: Vector3 = Geometry.vector3(-1, 0, 50);
      const geometry = new Geometry();

      const angle = geometry.getAngleTo(from, to);

      expect(angle).toBeCloseTo(90);
    });
  });
});
