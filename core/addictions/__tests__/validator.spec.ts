import { describe, expect, it } from 'vitest';

import { AddictionsValidator } from '../src';

describe('AddictionsValidator', () => {
  describe('#validateCraving', () => {
    it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если тяга %s вне пределов от 0 до 100, выбрасывает RangeError',
      (value) => {
        const validator = new AddictionsValidator();
        function validate() {
          validator.validateCraving(value, 0, 100);
        }

        expect(validate).toThrow(RangeError);
      }
    );

    it.each([0, 50, 100])('Если тяга %s в пределах от 0 до 100, не выбрасывает ошибку', (value) => {
      const validator = new AddictionsValidator();
      function validate() {
        validator.validateCraving(value, 0, 100);
      }

      expect(validate).not.toThrow();
    });
  });

  describe('#validateStrength', () => {
    it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если сила %s вне пределов от 0 до 100, выбрасывает RangeError',
      (strength) => {
        const validator = new AddictionsValidator();
        function validate() {
          validator.validateStrength(strength, 0, 100);
        }

        expect(validate).toThrow(RangeError);
      }
    );

    it.each([0, 50, 100])(
      'Если сила %s в пределах от 0 до 100, не выбрасывает ошибку',
      (strength) => {
        const validator = new AddictionsValidator();
        function validate() {
          validator.validateStrength(strength, 0, 100);
        }

        expect(validate).not.toThrow();
      }
    );
  });
});
