import { describe, expect, it } from 'vitest';

import { Optimism } from '../../../src/traits';

describe('Optimism', () => {
  describe('#expectAttempts', () => {
    it('При среднем оптимизме возвращает 1 / шанс', () => {
      const optimism = new Optimism((Optimism.MIN + Optimism.MAX) / 2);

      expect(optimism.expectAttempts(1 / 40)).toBe(40);
    });

    it('При максимальном оптимизме делит 1 / шанс на Optimism.ATTEMPTS_SPREAD', () => {
      const optimism = new Optimism(Optimism.MAX);

      expect(optimism.expectAttempts(1 / 60)).toBe(40);
    });

    it('При минимальном оптимизме умножает 1 / шанс на Optimism.ATTEMPTS_SPREAD', () => {
      const optimism = new Optimism(Optimism.MIN);

      expect(optimism.expectAttempts(1 / 40)).toBe(60);
    });

    it('На середине между средним и минимальным оптимизмом умножает 1 / шанс на √Optimism.ATTEMPTS_SPREAD', () => {
      const optimism = new Optimism(25);

      // 100 × √1.5 ≈ 122.47
      expect(optimism.expectAttempts(1 / 100)).toBe(122);
    });

    it('Округляет ожидание до целого числа попыток', () => {
      const optimism = new Optimism(Optimism.MAX);

      // 40 / 1.5 ≈ 26.67
      expect(optimism.expectAttempts(1 / 40)).toBe(27);
    });

    it.each([0, -0.1, 1.1, NaN])('Если шанс %d, выбрасывает RangeError', (chance) => {
      const optimism = new Optimism(50);

      expect(() => optimism.expectAttempts(chance)).toThrow(RangeError);
    });
  });
});
