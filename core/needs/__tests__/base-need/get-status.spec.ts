import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';
import { NeedStatus } from '../../src';

describe('BaseNeed', () => {
  describe('#getStatus', () => {
    it('Если значение ниже порога срочности, возвращает NeedStatus.Urgent', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: TestNeed.OPTIONS.urgentBelow - 1,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Urgent);
    });

    it('Если значение на пороге срочности, возвращает NeedStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: TestNeed.OPTIONS.urgentBelow,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Moderate);
    });

    it('Если значение на пороге спокойствия, возвращает NeedStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: TestNeed.OPTIONS.calmAbove,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Moderate);
    });

    it('Если значение выше порога спокойствия, возвращает NeedStatus.Calm', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: TestNeed.OPTIONS.calmAbove + 1,
      };

      const status = new TestNeed(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(NeedStatus.Calm);
    });

    it('Считает статус по значению на момент переданного времени', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: TestNeed.OPTIONS.urgentBelow,
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
