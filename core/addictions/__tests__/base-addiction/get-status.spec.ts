import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { AddictionStatus } from '../../src';
import { BaseAddiction } from '../../src/base-addiction';

/** Статус зависимости с переданной тягой на момент, когда её выставили */
function statusAt(craving: number): AddictionStatus {
  const record = {
    ...DEFAULT_RECORD,
    craving,
  };

  return new TestAddiction(record).getStatus(new ManualTime(record.since));
}

describe('BaseAddiction', () => {
  describe('#getStatus', () => {
    it('Если тяга выше порога тяги, возвращает AddictionStatus.Craving', () => {
      expect(statusAt(BaseAddiction.CRAVING_ABOVE + 1)).toBe(AddictionStatus.Craving);
    });

    it('Если тяга на пороге тяги, возвращает AddictionStatus.Moderate', () => {
      expect(statusAt(BaseAddiction.CRAVING_ABOVE)).toBe(AddictionStatus.Moderate);
    });

    it('Если тяга на пороге спокойствия, возвращает AddictionStatus.Moderate', () => {
      expect(statusAt(BaseAddiction.CALM_BELOW)).toBe(AddictionStatus.Moderate);
    });

    it('Если тяга ниже порога спокойствия, возвращает AddictionStatus.Calm', () => {
      expect(statusAt(BaseAddiction.CALM_BELOW - 1)).toBe(AddictionStatus.Calm);
    });

    it('Считает статус по тяге на момент переданного времени', () => {
      const record = {
        ...DEFAULT_RECORD,
        craving: BaseAddiction.CRAVING_ABOVE,
      };

      // Через час тяга поднялась выше порога тяги
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
