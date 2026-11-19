import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_OPTIONS, DEFAULT_STATE } from '../dev';
import { Gauge } from '../src';

/** Шесть часов после полуночи первого дня: за это время шкала падает на 25 */
const SIX_HOURS = {
  day: 1,
  hours: 6,
  minutes: 0,
};

describe('Gauge', () => {
  describe('#add', () => {
    it('Прибавляет amount к значению на момент time', () => {
      const gauge = new Gauge(
        {
          ...DEFAULT_STATE,
          value: 50,
        },
        DEFAULT_OPTIONS
      );
      const time = new ManualTime(SIX_HOURS);

      gauge.add(10, time);

      expect(gauge.get(time)).toBeCloseTo(50 - 25 + 10);
    });

    it('Отсчитывает падение от time', () => {
      const gauge = new Gauge(DEFAULT_STATE, DEFAULT_OPTIONS);

      gauge.add(10, new ManualTime(SIX_HOURS));

      expect(gauge.getState().since).toStrictEqual(SIX_HOURS);
    });

    it('Не поднимает значение выше max', () => {
      const gauge = new Gauge(DEFAULT_STATE, DEFAULT_OPTIONS);
      const time = new ManualTime(DEFAULT_STATE.since);

      gauge.add(10, time);

      expect(gauge.get(time)).toBe(DEFAULT_OPTIONS.max);
    });

    it('Если amount отрицательный, отнимает, но не опускает значение ниже min', () => {
      const gauge = new Gauge(
        {
          ...DEFAULT_STATE,
          value: 5,
        },
        DEFAULT_OPTIONS
      );
      const time = new ManualTime(DEFAULT_STATE.since);

      gauge.add(-10, time);

      expect(gauge.get(time)).toBe(DEFAULT_OPTIONS.min);
    });
  });
});
