import { describe, expect, it } from 'vitest';

import { Luck } from '../../../src/traits';

describe('Luck', () => {
  describe('#constructor', () => {
    it.each([Luck.MIN, (Luck.MIN + Luck.MAX) / 2, Luck.MAX])(
      'Если удачливость %d в пределах, не выбрасывает ошибку',
      (value) => {
        expect(() => new Luck(value)).not.toThrow();
      }
    );

    it('Если удачливость меньше Luck.MIN, выбрасывает RangeError', () => {
      expect(() => new Luck(Luck.MIN - 1)).toThrow(RangeError);
    });

    it('Если удачливость больше Luck.MAX, выбрасывает RangeError', () => {
      expect(() => new Luck(Luck.MAX + 1)).toThrow(RangeError);
    });

    it('Если удачливость не число, выбрасывает RangeError', () => {
      expect(() => new Luck(NaN)).toThrow(RangeError);
    });
  });
});
