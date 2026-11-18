import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_OPTIONS, DEFAULT_STATE } from '../dev';
import { Gauge } from '../src';

describe('Gauge', () => {
  describe('#get', () => {
    it('Если время не прошло, возвращает выставленное значение', () => {
      const state = {
        ...DEFAULT_STATE,
        value: 80,
      };

      expect(new Gauge(state, DEFAULT_OPTIONS).get(new ManualTime(state.since))).toBe(80);
    });

    it('Возвращает выставленное значение минус depletion.amount за каждые depletion.minutes от момента, когда его выставили, до переданного времени', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const gauge = new Gauge(
        {
          value: 80,
          since,
        },
        DEFAULT_OPTIONS
      );

      // Шкала падает на 100 за сутки, а прошла четверть суток: она упала на 25
      const value = gauge.get(
        new ManualTime({
          ...since,
          hours: since.hours + 6,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Считает прошедшее время через полночь', () => {
      const since = {
        day: 1,
        hours: 21,
        minutes: 0,
      };
      const gauge = new Gauge(
        {
          value: 80,
          since,
        },
        DEFAULT_OPTIONS
      );

      // Прошло 6 часов, четверть суток: шкала упала на 25
      const value = gauge.get(
        new ManualTime({
          day: since.day + 1,
          hours: 3,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Не накапливает погрешность: за depletion.minutes значение падает ровно на depletion.amount', () => {
      const gauge = new Gauge(DEFAULT_STATE, {
        ...DEFAULT_OPTIONS,
        depletion: {
          amount: 75 * 100,
          minutes: 24 * 60 * 100,
        },
      });

      expect(
        gauge.get(
          new ManualTime({
            day: 2,
            hours: 0,
            minutes: 0,
          })
        )
      ).toBe(25);
    });

    it('Если depletion.amount — 0, значение не падает', () => {
      const gauge = new Gauge(DEFAULT_STATE, {
        ...DEFAULT_OPTIONS,
        depletion: {
          amount: 0,
          minutes: 24 * 60,
        },
      });

      expect(
        gauge.get(
          new ManualTime({
            day: 30,
            hours: 0,
            minutes: 0,
          })
        )
      ).toBe(100);
    });

    it('Не опускает значение ниже min', () => {
      const gauge = new Gauge(
        {
          ...DEFAULT_STATE,
          value: 10,
        },
        DEFAULT_OPTIONS
      );

      expect(
        gauge.get(
          new ManualTime({
            day: 2,
            hours: 0,
            minutes: 0,
          })
        )
      ).toBe(DEFAULT_OPTIONS.min);
    });

    it('Если время раньше момента, когда выставили значение, возвращает выставленное значение', () => {
      const since = {
        day: 2,
        hours: 10,
        minutes: 0,
      };
      const gauge = new Gauge(
        {
          value: 80,
          since,
        },
        DEFAULT_OPTIONS
      );

      expect(
        gauge.get(
          new ManualTime({
            ...since,
            day: 1,
          })
        )
      ).toBe(80);
    });
  });
});
