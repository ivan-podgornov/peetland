import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator, DEFAULT_RECORD, TestNeed } from '../../dev';
import { BaseNeed } from '../../src/base-need';

describe('BaseNeed', () => {
  describe('#constructor', () => {
    it('Валидирует значение в пределах потребности', () => {
      const validator = createMockedNeedsValidator();

      new TestNeed(
        {
          ...DEFAULT_RECORD,
          value: 40,
        },
        { validator }
      );

      expect(validator.validateValue).toHaveBeenCalledExactlyOnceWith(
        40,
        BaseNeed.MIN_NEED,
        BaseNeed.MAX_NEED
      );
    });

    it('Если валидатор выбросил ошибку, выбрасывает ту же ошибку', () => {
      const error = new RangeError();
      const validator = createMockedNeedsValidator();
      validator.validateValue.mockThrow(error);
      function create() {
        return new TestNeed(DEFAULT_RECORD, { validator });
      }

      expect(create).toThrow(error);
    });
  });
});
