import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { AddictionStatus } from '../../src';
import { BaseAddiction } from '../../src/base-addiction';

/** Статус зависимости с переданной удовлетворённостью на момент, когда её выставили */
function statusAt(satisfaction: number): AddictionStatus {
  const record = {
    ...DEFAULT_RECORD,
    satisfaction,
  };

  return new TestAddiction(record).getStatus(new ManualTime(record.since));
}

describe('BaseAddiction', () => {
  describe('#getStatus', () => {
    it('Если удовлетворённость ниже CRAVING_BELOW, возвращает AddictionStatus.Craving', () => {
      expect(statusAt(BaseAddiction.CRAVING_BELOW - 1)).toBe(AddictionStatus.Craving);
    });

    it('Если удовлетворённость от CRAVING_BELOW до CALM_ABOVE, возвращает AddictionStatus.Moderate', () => {
      expect(statusAt(BaseAddiction.CRAVING_BELOW)).toBe(AddictionStatus.Moderate);
    });

    it('Если удовлетворённость выше CALM_ABOVE, возвращает AddictionStatus.Calm', () => {
      expect(statusAt(BaseAddiction.CALM_ABOVE + 1)).toBe(AddictionStatus.Calm);
    });
  });
});
