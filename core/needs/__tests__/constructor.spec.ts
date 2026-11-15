import { describe, expect, it } from 'vitest';

import { createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#constructor', () => {
    it('Собирает фабрикой каждую потребность из её записи', () => {
      const needFactory = createMockedNeedFactory();
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

      new Needs(state, { needFactory });

      expect(needFactory.create).toHaveBeenCalledExactlyOnceWith(Need.Satiety, state[Need.Satiety]);
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
