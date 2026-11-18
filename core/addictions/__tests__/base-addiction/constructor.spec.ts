import { describe, expect, it } from 'vitest';

import { createMockedAddictionsValidator, DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('#constructor', () => {
    it('Валидирует удовлетворённость в пределах', () => {
      const validator = createMockedAddictionsValidator();

      new TestAddiction(
        {
          ...DEFAULT_RECORD,
          satisfaction: 40,
        },
        { validator }
      );

      expect(validator.validateSatisfaction).toHaveBeenCalledExactlyOnceWith(
        40,
        BaseAddiction.MIN_SATISFACTION,
        BaseAddiction.MAX_SATISFACTION
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
      validator.validateSatisfaction.mockThrow(error);
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
