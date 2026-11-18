import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { AddictionStatus } from '../../src';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('#getStatus', () => {
    it('Если значение ниже порога срочности, возвращает AddictionStatus.Urgent', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseAddiction.URGENT_BELOW - 1,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Urgent);
    });

    it('Если значение на пороге срочности, возвращает AddictionStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseAddiction.URGENT_BELOW,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Moderate);
    });

    it('Если значение на пороге спокойствия, возвращает AddictionStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseAddiction.CALM_ABOVE,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Moderate);
    });

    it('Если значение выше порога спокойствия, возвращает AddictionStatus.Calm', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseAddiction.CALM_ABOVE + 1,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Calm);
    });

    it('Считает статус по значению на момент переданного времени', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: BaseAddiction.URGENT_BELOW,
      };

      // Через час зависимость упала ниже порога срочности
      const status = new TestAddiction(record).getStatus(
        new ManualTime({
          ...record.since,
          hours: record.since.hours + 1,
        })
      );

      expect(status).toBe(AddictionStatus.Urgent);
    });
  });
});
