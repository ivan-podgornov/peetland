import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TestNeed } from '../../dev';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

describe('BaseNeed', () => {
  describe('#isUrgent', () => {
    it('Если значение ниже порога срочности, возвращает true', () => {
      const need = new TestNeed({
        value: TestNeed.URGENT_BELOW - 1,
        since,
      });

      expect(need.isUrgent(new ManualTime(since))).toBe(true);
    });

    it('Если значение на пороге срочности, возвращает false', () => {
      const need = new TestNeed({
        value: TestNeed.URGENT_BELOW,
        since,
      });

      expect(need.isUrgent(new ManualTime(since))).toBe(false);
    });

    it('Считает срочность по значению на момент переданного времени', () => {
      const need = new TestNeed({
        value: TestNeed.URGENT_BELOW,
        since,
      });

      // Через час потребность упала ниже порога
      const result = need.isUrgent(
        new ManualTime({
          ...since,
          hours: 11,
        })
      );

      expect(result).toBe(true);
    });
  });
});
