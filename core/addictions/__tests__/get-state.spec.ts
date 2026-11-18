import { describe, expect, it } from 'vitest';

import {
  createMockedAddiction,
  createMockedAddictionFactory,
  createAddictionsState,
  DEFAULT_RECORD,
} from '../dev';
import { Addiction, Addictions } from '../src';

describe('Addictions', () => {
  describe('#getState', () => {
    it('Возвращает состояние каждой зависимости', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: 80,
      };
      const addictions = new Addictions(createAddictionsState(), {
        addictionFactory: createMockedAddictionFactory(createMockedAddiction(record)),
      });

      expect(addictions.getState()).toStrictEqual({ [Addiction.Alcoholism]: record });
    });
  });
});
