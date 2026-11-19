import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_OPTIONS, DEFAULT_STATE } from '../dev';
import { Gauge, GaugeLevel } from '../src';

/** Уровень шкалы с переданным значением на момент, когда его выставили */
function levelAt(value: number): GaugeLevel {
  const state = {
    ...DEFAULT_STATE,
    value,
  };

  return new Gauge(state, DEFAULT_OPTIONS).getLevel(new ManualTime(state.since));
}

describe('Gauge', () => {
  describe('#getLevel', () => {
    it('Если значение ниже lowBelow, возвращает GaugeLevel.Low', () => {
      expect(levelAt(DEFAULT_OPTIONS.lowBelow - 1)).toBe(GaugeLevel.Low);
    });

    it('Если значение на lowBelow, возвращает GaugeLevel.Middle', () => {
      expect(levelAt(DEFAULT_OPTIONS.lowBelow)).toBe(GaugeLevel.Middle);
    });

    it('Если значение на highAbove, возвращает GaugeLevel.Middle', () => {
      expect(levelAt(DEFAULT_OPTIONS.highAbove)).toBe(GaugeLevel.Middle);
    });

    it('Если значение выше highAbove, возвращает GaugeLevel.High', () => {
      expect(levelAt(DEFAULT_OPTIONS.highAbove + 1)).toBe(GaugeLevel.High);
    });

    it('Считает уровень по значению на момент переданного времени', () => {
      const gauge = new Gauge(
        {
          ...DEFAULT_STATE,
          value: DEFAULT_OPTIONS.lowBelow,
        },
        DEFAULT_OPTIONS
      );

      // Через час значение упало ниже lowBelow
      expect(
        gauge.getLevel(
          new ManualTime({
            day: 1,
            hours: 1,
            minutes: 0,
          })
        )
      ).toBe(GaugeLevel.Low);
    });
  });
});
