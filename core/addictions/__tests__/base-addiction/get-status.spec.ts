import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { AddictionStatus } from '../../src';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('#getStatus', () => {
    it('Если удовлетворённость ниже порога тяги, возвращает AddictionStatus.Craving', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: BaseAddiction.CRAVING_BELOW - 1,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Craving);
    });

    it('Если удовлетворённость на пороге тяги, возвращает AddictionStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: BaseAddiction.CRAVING_BELOW,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Moderate);
    });

    it('Если удовлетворённость на пороге спокойствия, возвращает AddictionStatus.Moderate', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: BaseAddiction.CALM_ABOVE,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Moderate);
    });

    it('Если удовлетворённость выше порога спокойствия, возвращает AddictionStatus.Calm', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: BaseAddiction.CALM_ABOVE + 1,
      };

      const status = new TestAddiction(record).getStatus(new ManualTime(record.since));

      expect(status).toBe(AddictionStatus.Calm);
    });

    it('Считает статус по удовлетворённости на момент переданного времени', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: BaseAddiction.CRAVING_BELOW,
      };

      // Через час удовлетворённость упала ниже порога тяги
      const status = new TestAddiction(record).getStatus(
        new ManualTime({
          ...record.since,
          hours: record.since.hours + 1,
        })
      );

      expect(status).toBe(AddictionStatus.Craving);
    });
  });
});
