import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';

describe('Geometry', () => {
  describe('#isWithinAngle', () => {
    it('Если угол отличается от целевого меньше допуска, возвращает true', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(100, 90, 15);

      expect(result).toBe(true);
    });

    it('Если угол отличается от целевого больше допуска, возвращает false', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(110, 90, 15);

      expect(result).toBe(false);
    });

    it('Если угол отличается от целевого ровно на допуск, возвращает true', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(105, 90, 15);

      expect(result).toBe(true);
    });

    it('Если угол меньше целевого в пределах допуска, возвращает true', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(80, 90, 15);

      expect(result).toBe(true);
    });

    it('Если углы совпадают и допуск равен 0, возвращает true', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(90, 90, 0);

      expect(result).toBe(true);
    });

    it('Если допуск не передан и углы совпадают, возвращает true', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(90, 90);

      expect(result).toBe(true);
    });

    it('Если допуск не передан и углы отличаются, возвращает false', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(91, 90);

      expect(result).toBe(false);
    });

    it('Если угол близок к целевому через переход 360°, возвращает true', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(350, 5, 15);

      expect(result).toBe(true);
    });

    it('Если целевой угол близок к углу через переход 360°, возвращает true', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(5, 350, 15);

      expect(result).toBe(true);
    });

    it('Если через переход 360° разница больше допуска, возвращает false', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(340, 5, 15);

      expect(result).toBe(false);
    });

    it('Если угол отрицательный, сравнивает его как равный углу из [0, 360)', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(-10, 350, 0);

      expect(result).toBe(true);
    });

    it('Если угол больше 360°, сравнивает его как равный углу из [0, 360)', () => {
      const geometry = new Geometry();

      const result = geometry.isWithinAngle(450, 90, 0);

      expect(result).toBe(true);
    });
  });
});
