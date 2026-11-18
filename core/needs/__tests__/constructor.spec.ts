import { describe, expect, it } from 'vitest';

import { createMockedNeedFactory, createNeedsState, DEFAULT_RECORD } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#constructor', () => {
    it('Собирает фабрикой каждую потребность из её записи', () => {
      const needFactory = createMockedNeedFactory();
      const record = {
        ...DEFAULT_RECORD,
        value: 40,
      };

      new Needs(createNeedsState({ [Need.Satiety]: record }), { needFactory });

      expect(needFactory.create).toHaveBeenCalledExactlyOnceWith(Need.Satiety, record);
    });

    it('Если фабрика выбросила ошибку, выбрасывает ту же ошибку', () => {
      const error = new RangeError();
      const needFactory = createMockedNeedFactory();
      needFactory.create.mockThrow(error);
      function create() {
        return new Needs(createNeedsState(), { needFactory });
      }

      expect(create).toThrow(error);
    });
  });
});
