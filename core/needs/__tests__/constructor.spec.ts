import { describe, expect, it } from 'vitest';

import {
  createMockedNeedsValidator,
  createNeedsDeps,
  createNeedsState,
  TEST_DEPLETION_MINUTES,
} from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#constructor', () => {
    it('Проверяет валидатором значение каждой потребности в пределах потребности', () => {
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

    it('Проверяет валидатором скорость падения каждой потребности из описаний', () => {
      const validator = createMockedNeedsValidator();

      new Needs(createNeedsState(), createNeedsDeps({ validator }));

      expect(validator.validateDepletion).toHaveBeenCalledExactlyOnceWith(TEST_DEPLETION_MINUTES);
    });

    it('Если валидатор выбросил ошибку на значение, выбрасывает ту же ошибку', () => {
      const error = new RangeError('значение');
      const validator = createMockedNeedsValidator();
      validator.validateValue.mockImplementation(() => {
        throw error;
      });
      function create() {
        return new Needs(createNeedsState(), createNeedsDeps({ validator }));
      }

      expect(create).toThrow(error);
    });

    it('Если валидатор выбросил ошибку на скорость падения, выбрасывает ту же ошибку', () => {
      const error = new RangeError('скорость');
      const validator = createMockedNeedsValidator();
      validator.validateDepletion.mockImplementation(() => {
        throw error;
      });
      function create() {
        return new Needs(createNeedsState(), createNeedsDeps({ validator }));
      }

      expect(create).toThrow(error);
    });
  });
});
