import { describe, expect, it } from 'vitest';

import { createNeedsDeps } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#getState', () => {
    it('Возвращает выставленное значение и момент, когда его выставили', () => {
      const state = {
        [Need.Satiety]: {
          value: 80,
          since: {
            day: 1,
            hours: 10,
            minutes: 0,
          },
        },
      };
      const needs = new Needs(state, createNeedsDeps());

      expect(needs.getState()).toStrictEqual(state);
    });

    it('Из состояния собираются такие же потребности', () => {
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 80,
            since: {
              day: 1,
              hours: 10,
              minutes: 0,
            },
          },
        },
        createNeedsDeps()
      );

      const restored = new Needs(needs.getState(), createNeedsDeps());

      expect(restored.getState()).toStrictEqual(needs.getState());
    });
  });
});
