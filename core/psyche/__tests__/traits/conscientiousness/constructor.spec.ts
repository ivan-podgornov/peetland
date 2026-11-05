import { describe, expect, it } from 'vitest';

import { Conscientiousness } from '../../../src/traits';

describe('Conscientiousness', () => {
  describe('#constructor', () => {
    it('Если совестливость меньше Conscientiousness.MIN, выбрасывает RangeError', () => {
      expect(() => new Conscientiousness(Conscientiousness.MIN - 1)).toThrow(RangeError);
    });

    it('Если совестливость больше Conscientiousness.MAX, выбрасывает RangeError', () => {
      expect(() => new Conscientiousness(Conscientiousness.MAX + 1)).toThrow(RangeError);
    });

    it('Если совестливость не число, выбрасывает RangeError', () => {
      expect(() => new Conscientiousness(NaN)).toThrow(RangeError);
    });
  });
});
