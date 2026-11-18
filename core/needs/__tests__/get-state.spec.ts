import { describe, expect, it } from 'vitest';

import {
  createMockedNeed,
  createMockedNeedFactory,
  createNeedsState,
  DEFAULT_RECORD,
} from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#getState', () => {
    it('Возвращает состояние каждой потребности', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 80,
      };
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(createMockedNeed(record)),
      });

      expect(needs.getState()).toStrictEqual({
        [Need.Satiety]: record,
        [Need.Alcoholism]: record,
      });
    });
  });
});
