import { describe, expect, it } from 'vitest';

import { createMockedAddictionFactory, createAddictionsState, DEFAULT_RECORD } from '../dev';
import { Addiction, Addictions } from '../src';

describe('Addictions', () => {
  describe('#constructor', () => {
    it('Собирает фабрикой каждую зависимость из её записи', () => {
      const addictionFactory = createMockedAddictionFactory();
      const record = {
        ...DEFAULT_RECORD,
        value: 40,
      };

      new Addictions(createAddictionsState({ [Addiction.Alcoholism]: record }), {
        addictionFactory,
      });

      expect(addictionFactory.create).toHaveBeenCalledExactlyOnceWith(Addiction.Alcoholism, record);
    });

    it('Если фабрика выбросила ошибку, выбрасывает ту же ошибку', () => {
      const error = new RangeError();
      const addictionFactory = createMockedAddictionFactory();
      addictionFactory.create.mockThrow(error);
      function create() {
        return new Addictions(createAddictionsState(), { addictionFactory });
      }

      expect(create).toThrow(error);
    });
  });
});
