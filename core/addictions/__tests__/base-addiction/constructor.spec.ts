import { describe, expect, it } from 'vitest';

import { createMockedAddictionsValidator, DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('#constructor', () => {
    it('Валидирует значение в пределах зависимости', () => {
      const validator = createMockedAddictionsValidator();

      new TestAddiction(
        {
          ...DEFAULT_RECORD,
          value: 40,
        },
        { validator }
      );

      expect(validator.validateValue).toHaveBeenCalledExactlyOnceWith(
        40,
        BaseAddiction.MIN_VALUE,
        BaseAddiction.MAX_VALUE
      );
    });

    it('Валидирует силу в пределах силы зависимости', () => {
      const validator = createMockedAddictionsValidator();

      new TestAddiction(
        {
          ...DEFAULT_RECORD,
          strength: 70,
        },
        { validator }
      );

      expect(validator.validateStrength).toHaveBeenCalledExactlyOnceWith(
        70,
        BaseAddiction.MIN_STRENGTH,
        BaseAddiction.MAX_STRENGTH
      );
    });

    it('Если валидатор выбросил ошибку, выбрасывает ту же ошибку', () => {
      const error = new RangeError();
      const validator = createMockedAddictionsValidator();
      validator.validateValue.mockThrow(error);
      function create() {
        return new TestAddiction(DEFAULT_RECORD, { validator });
      }

      expect(create).toThrow(error);
    });

    it('Если валидатор выбросил ошибку на силе, выбрасывает ту же ошибку', () => {
      const error = new RangeError();
      const validator = createMockedAddictionsValidator();
      validator.validateStrength.mockThrow(error);
      function create() {
        return new TestAddiction(DEFAULT_RECORD, { validator });
      }

      expect(create).toThrow(error);
    });
  });
});
