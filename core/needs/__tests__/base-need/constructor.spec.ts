import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator } from '../../dev';
import { BaseNeed, Satiety } from '../../src';

const since = {
  day: 1,
  hours: 0,
  minutes: 0,
};

describe('BaseNeed', () => {
  describe('#constructor', () => {
    it('Валидирует значение в пределах потребности', () => {
      const validator = createMockedNeedsValidator();

      new Satiety(
        {
          value: 40,
          since,
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
        return new Satiety(
          {
            value: 40,
            since,
          },
          { validator }
        );
      }

      expect(create).toThrow(error);
    });
  });
});
