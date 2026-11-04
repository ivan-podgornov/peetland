import { describe, expect, it } from 'vitest';

import { Optimism } from '../../../src/traits';
import { MAX_OPTIMISM, MIN_OPTIMISM } from '../../../src/traits/optimism';

describe('Optimism', () => {
  describe('#constructor', () => {
    it.each([MIN_OPTIMISM, (MIN_OPTIMISM + MAX_OPTIMISM) / 2, MAX_OPTIMISM])(
      'Если оптимизм %d в пределах, не выбрасывает ошибку',
      (value) => {
        expect(() => new Optimism(value)).not.toThrow();
      }
    );

    it('Если оптимизм меньше MIN_OPTIMISM, выбрасывает RangeError', () => {
      expect(() => new Optimism(MIN_OPTIMISM - 1)).toThrow(RangeError);
    });

    it('Если оптимизм больше MAX_OPTIMISM, выбрасывает RangeError', () => {
      expect(() => new Optimism(MAX_OPTIMISM + 1)).toThrow(RangeError);
    });

    it('Если оптимизм не число, выбрасывает RangeError', () => {
      expect(() => new Optimism(NaN)).toThrow(RangeError);
    });
  });
});
