import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';

describe('Geometry', () => {
  describe('#normalizeAngle', () => {
    it('Если угол в диапазоне [0, 360), возвращает его без изменений', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(90);

      expect(angle).toBe(90);
    });

    it('Если угол равен 0, возвращает 0', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(0);

      expect(angle).toBe(0);
    });

    it('Если угол равен 360, возвращает 0', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(360);

      expect(angle).toBe(0);
    });

    it('Если угол больше 360, возвращает остаток от полного оборота', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(450);

      expect(angle).toBe(90);
    });

    it('Если угол больше нескольких полных оборотов, возвращает остаток от полного оборота', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(1170);

      expect(angle).toBe(90);
    });

    it('Если угол отрицательный, возвращает тот же поворот в диапазоне [0, 360)', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(-10);

      expect(angle).toBe(350);
    });

    it('Если угол меньше −360, возвращает тот же поворот в диапазоне [0, 360)', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(-370);

      expect(angle).toBe(350);
    });

    it('Если угол равен −360, возвращает 0', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(-360);

      expect(angle).toBe(0);
    });

    it('Сохраняет дробную часть угла', () => {
      const geometry = new Geometry();

      const angle = geometry.normalizeAngle(-0.5);

      expect(angle).toBe(359.5);
    });
  });
});
