import { describe, expect, it } from 'vitest';

import { NeedsValidator } from '../src';

describe('NeedsValidator', () => {
  describe('#validateValue', () => {
    it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если значение %s вне пределов от 0 до 100, выбрасывает RangeError',
      (value) => {
        const validator = new NeedsValidator();
        function validate() {
          validator.validateValue(value, 0, 100);
        }

        expect(validate).toThrow(RangeError);
      }
    );

    it.each([0, 50, 100])(
      'Если значение %s в пределах от 0 до 100, не выбрасывает ошибку',
      (value) => {
        const validator = new NeedsValidator();
        function validate() {
          validator.validateValue(value, 0, 100);
        }

        expect(validate).not.toThrow();
      }
    );
  });

  describe('#validateStrength', () => {
    it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если сила %s вне пределов от 0 до 100, выбрасывает RangeError',
      (strength) => {
        const validator = new NeedsValidator();
        function validate() {
          validator.validateStrength(strength, 0, 100);
        }

        expect(validate).toThrow(RangeError);
      }
    );

    it.each([0, 50, 100])(
      'Если сила %s в пределах от 0 до 100, не выбрасывает ошибку',
      (strength) => {
        const validator = new NeedsValidator();
        function validate() {
          validator.validateStrength(strength, 0, 100);
        }

        expect(validate).not.toThrow();
      }
    );
  });
});
