import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';
import { ActivityType } from '../../src';

const EAT = {
  type: ActivityType.Eat,
  details: { food: Item.SmilePizza },
} as const;

describe('BaseNeed', () => {
  describe('#perform', () => {
    it('Прибавляет вклад занятия из getGain к значению на момент, когда занятие закончилось', () => {
      const need = new TestNeed({
        ...DEFAULT_RECORD,
        value: 50,
      });
      // За 6 часов из суток значение падает на 25
      const time = new ManualTime({
        ...DEFAULT_RECORD.since,
        hours: DEFAULT_RECORD.since.hours + 6,
      });

      need.perform(EAT, time);

      expect(need.get(time)).toBeCloseTo(50 - 25 + TestNeed.GAIN);
    });
  });
});
