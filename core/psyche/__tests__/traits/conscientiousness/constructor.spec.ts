import { describe, expect, it } from 'vitest';

import { Conscientiousness, MAX_CONSCIENTIOUSNESS, MIN_CONSCIENTIOUSNESS } from '../../../src';

describe('Conscientiousness', () => {
  describe('#constructor', () => {
    it('Если совестливость меньше MIN_CONSCIENTIOUSNESS, выбрасывает RangeError', () => {
      expect(() => new Conscientiousness(MIN_CONSCIENTIOUSNESS - 1)).toThrow(RangeError);
    });

    it('Если совестливость больше MAX_CONSCIENTIOUSNESS, выбрасывает RangeError', () => {
      expect(() => new Conscientiousness(MAX_CONSCIENTIOUSNESS + 1)).toThrow(RangeError);
    });

    it('Если совестливость не число, выбрасывает RangeError', () => {
      expect(() => new Conscientiousness(NaN)).toThrow(RangeError);
    });
  });
});
