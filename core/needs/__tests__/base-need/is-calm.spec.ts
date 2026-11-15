import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TestNeed } from '../../dev';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

describe('BaseNeed', () => {
  describe('#isCalm', () => {
    it('Если значение выше порога спокойствия, возвращает true', () => {
      const need = new TestNeed({
        value: TestNeed.CALM_ABOVE + 1,
        since,
      });

      expect(need.isCalm(new ManualTime(since))).toBe(true);
    });

    it('Если значение на пороге спокойствия, возвращает false', () => {
      const need = new TestNeed({
        value: TestNeed.CALM_ABOVE,
        since,
      });

      expect(need.isCalm(new ManualTime(since))).toBe(false);
    });

    it('Считает спокойствие по значению на момент переданного времени', () => {
      const need = new TestNeed({
        value: TestNeed.CALM_ABOVE + 1,
        since,
      });

      // Через час потребность упала до порога спокойствия и ниже
      const result = need.isCalm(
        new ManualTime({
          ...since,
          hours: 11,
        })
      );

      expect(result).toBe(false);
    });
  });
});
