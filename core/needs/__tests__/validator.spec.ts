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

  describe('#validateDepletion', () => {
    it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если потребность падает за %s минут, выбрасывает RangeError',
      (minutes) => {
        const validator = new NeedsValidator();
        function validate() {
          validator.validateDepletion(minutes);
        }

        expect(validate).toThrow(RangeError);
      }
    );

    it('Если потребность падает за конечное положительное число минут, не выбрасывает ошибку', () => {
      const validator = new NeedsValidator();
      function validate() {
        validator.validateDepletion(0.5);
      }

      expect(validate).not.toThrow();
    });
  });

  describe('#validateAmount', () => {
    it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если восполнение %s, выбрасывает RangeError',
      (amount) => {
        const validator = new NeedsValidator();
        function validate() {
          validator.validateAmount(amount);
        }

        expect(validate).toThrow(RangeError);
      }
    );

    it.each([0, 20])('Если восполнение %s, не выбрасывает ошибку', (amount) => {
      const validator = new NeedsValidator();
      function validate() {
        validator.validateAmount(amount);
      }

      expect(validate).not.toThrow();
    });
  });
});
