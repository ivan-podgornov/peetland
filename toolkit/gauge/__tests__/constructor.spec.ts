import { describe, expect, it } from 'vitest';

import { DEFAULT_OPTIONS, DEFAULT_STATE } from '../dev';
import { Gauge } from '../src';

describe('Gauge', () => {
  describe('#constructor', () => {
    it('Если значение выше max, держит его на max', () => {
      const gauge = new Gauge(
        {
          ...DEFAULT_STATE,
          value: DEFAULT_OPTIONS.max + 1,
        },
        DEFAULT_OPTIONS
      );

      expect(gauge.getState().value).toBe(DEFAULT_OPTIONS.max);
    });

    it('Если значение ниже min, держит его на min', () => {
      const gauge = new Gauge(
        {
          ...DEFAULT_STATE,
          value: DEFAULT_OPTIONS.min - 1,
        },
        DEFAULT_OPTIONS
      );

      expect(gauge.getState().value).toBe(DEFAULT_OPTIONS.min);
    });
  });

  describe('#getState', () => {
    it('Возвращает выставленное значение и момент, когда его выставили', () => {
      const state = {
        ...DEFAULT_STATE,
        value: 80,
      };

      expect(new Gauge(state, DEFAULT_OPTIONS).getState()).toStrictEqual(state);
    });
  });
});
