import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';
import { NeedStatus } from '../../src';
import { BaseNeed } from '../../src/base-need';

describe('BaseNeed', () => {
  describe('#getStatus', () => {
    it('Если значение ниже порога срочности, возвращает NeedStatus.Urgent', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseNeed.URGENT_BELOW - 1,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Urgent);
    });

    it('Если значение на пороге срочности, возвращает NeedStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseNeed.URGENT_BELOW,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Moderate);
    });

    it('Если значение на пороге спокойствия, возвращает NeedStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseNeed.CALM_ABOVE,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Moderate);
    });

    it('Если значение выше порога спокойствия, возвращает NeedStatus.Calm', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseNeed.CALM_ABOVE + 1,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Calm);
    });

    it('Считает статус по значению на момент переданного времени', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseNeed.URGENT_BELOW,
      };

      // Через час потребность упала ниже порога срочности
      const status = new TestNeed(record).getStatus(
        new ManualTime({
          ...record.since,
          hours: record.since.hours + 1,
        })
      );

      expect(status).toBe(NeedStatus.Urgent);
    });
  });
});
