import { describe, expect, it } from 'vitest';

import { Optimism } from '../../../src/traits';

describe('Optimism', () => {
  describe('#constructor', () => {
    it.each([Optimism.MIN, (Optimism.MIN + Optimism.MAX) / 2, Optimism.MAX])(
      'Если оптимизм %d в пределах, не выбрасывает ошибку',
      (value) => {
        expect(() => new Optimism(value)).not.toThrow();
      }
    );

    it('Если оптимизм меньше Optimism.MIN, выбрасывает RangeError', () => {
      expect(() => new Optimism(Optimism.MIN - 1)).toThrow(RangeError);
    });

    it('Если оптимизм больше Optimism.MAX, выбрасывает RangeError', () => {
      expect(() => new Optimism(Optimism.MAX + 1)).toThrow(RangeError);
    });

    it('Если оптимизм не число, выбрасывает RangeError', () => {
      expect(() => new Optimism(NaN)).toThrow(RangeError);
    });
  });
});
