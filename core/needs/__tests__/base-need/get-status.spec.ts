import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';
import { NeedStatus } from '../../src';
import { BaseNeed } from '../../src/base-need';

/** Статус потребности с переданным значением на момент, когда его выставили */
function statusAt(value: number): NeedStatus {
  const record = {
    ...DEFAULT_RECORD,
    value,
  };

  return new TestNeed(record).getStatus(new ManualTime(record.since));
}

describe('BaseNeed', () => {
  describe('#getStatus', () => {
    it('Если значение ниже URGENT_BELOW, возвращает NeedStatus.Urgent', () => {
      expect(statusAt(BaseNeed.URGENT_BELOW - 1)).toBe(NeedStatus.Urgent);
    });

    it('Если значение от URGENT_BELOW до CALM_ABOVE, возвращает NeedStatus.Moderate', () => {
      expect(statusAt(BaseNeed.URGENT_BELOW)).toBe(NeedStatus.Moderate);
    });

    it('Если значение выше CALM_ABOVE, возвращает NeedStatus.Calm', () => {
      expect(statusAt(BaseNeed.CALM_ABOVE + 1)).toBe(NeedStatus.Calm);
    });
  });
});
