import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { ActivityType } from '../../src';
import { BaseAddiction } from '../../src/base-addiction';

const DRINK = {
  type: ActivityType.Drink,
  details: { booze: Item.Booze },
} as const;

describe('BaseAddiction', () => {
  describe('#perform', () => {
    it('Прибавляет вклад занятия из getGain к значению на момент, когда занятие закончилось', () => {
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        value: 50,
      });
      // За 6 часов из суток значение падает на 25
      const time = new ManualTime({
        ...DEFAULT_RECORD.since,
        hours: DEFAULT_RECORD.since.hours + 6,
      });

      addiction.perform(DRINK, time);

      expect(addiction.get(time)).toBeCloseTo(50 - 25 + TestAddiction.GAIN);
    });

    it('Отсчитывает падение от момента, когда занятие закончилось', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);
      const end = {
        ...DEFAULT_RECORD.since,
        hours: DEFAULT_RECORD.since.hours + 6,
      };

      addiction.perform(DRINK, new ManualTime(end));

      expect(addiction.getState().since).toStrictEqual(end);
    });

    it('Не поднимает значение выше BaseAddiction.MAX_VALUE', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);
      const time = new ManualTime(DEFAULT_RECORD.since);

      addiction.perform(DRINK, time);

      expect(addiction.get(time)).toBe(BaseAddiction.MAX_VALUE);
    });

    it('Не меняет силу зависимости', () => {
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        strength: 70,
      });

      addiction.perform(DRINK, new ManualTime(DEFAULT_RECORD.since));

      expect(addiction.getState().strength).toBe(70);
    });
  });
});
