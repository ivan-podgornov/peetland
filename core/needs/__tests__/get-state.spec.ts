import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#getState', () => {
    it('Возвращает состояние каждой потребности', () => {
      const record = {
        value: 80,
        since: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      };
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(createMockedNeed(record)),
      });

      expect(needs.getState()).toStrictEqual({ [Need.Satiety]: record });
    });
  });
});
