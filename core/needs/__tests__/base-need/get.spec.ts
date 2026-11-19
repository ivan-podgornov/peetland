import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';
import { BaseNeed } from '../../src/base-need';

describe('BaseNeed', () => {
  describe('#get', () => {
    it('Падает от MAX_NEED до MIN_NEED за depletionMinutes из опций подкласса', () => {
      // У TestNeed depletionMinutes — сутки
      const need = new TestNeed({
        ...DEFAULT_RECORD,
        value: BaseNeed.MAX_NEED,
      });

      expect(
        need.get(
          new ManualTime({
            day: 1,
            hours: 12,
            minutes: 0,
          })
        )
      ).toBeCloseTo(50);
      expect(
        need.get(
          new ManualTime({
            day: 2,
            hours: 0,
            minutes: 0,
          })
        )
      ).toBe(BaseNeed.MIN_NEED);
    });
  });
});
