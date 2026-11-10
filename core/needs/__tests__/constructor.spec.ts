import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator, createNeedsDeps, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#constructor', () => {
    it('Валидирует значение каждой потребности в пределах потребности', () => {
      const validator = createMockedNeedsValidator();
      const state = createNeedsState({
        [Need.Satiety]: {
          value: 40,
          since: {
            day: 1,
            hours: 0,
            minutes: 0,
          },
        },
      });

      new Needs(state, createNeedsDeps({ validator }));

      expect(validator.validateValue).toHaveBeenCalledExactlyOnceWith(
        40,
        Needs.MIN_NEED,
        Needs.MAX_NEED
      );
    });

    it('Если валидатор выбросил ошибку, выбрасывает ту же ошибку', () => {
      const error = new RangeError();
      const validator = createMockedNeedsValidator();
      validator.validateValue.mockThrow(error);
      function create() {
        return new Needs(createNeedsState(), createNeedsDeps({ validator }));
      }

      expect(create).toThrow(error);
    });
  });
});
