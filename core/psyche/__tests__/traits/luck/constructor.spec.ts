import { describe, expect, it } from 'vitest';

import { Luck } from '../../../src/traits';
import { MAX_LUCK, MIN_LUCK } from '../../../src/traits/luck';

describe('Luck', () => {
  describe('#constructor', () => {
    it('Если удачливость меньше MIN_LUCK, выбрасывает RangeError', () => {
      expect(() => new Luck(MIN_LUCK - 1)).toThrow(RangeError);
    });

    it('Если удачливость больше MAX_LUCK, выбрасывает RangeError', () => {
      expect(() => new Luck(MAX_LUCK + 1)).toThrow(RangeError);
    });

    it('Если удачливость не число, выбрасывает RangeError', () => {
      expect(() => new Luck(NaN)).toThrow(RangeError);
    });
  });
});
