import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('#get', () => {
    it('Если время не прошло, возвращает выставленную тягу', () => {
      const record = {
        ...DEFAULT_RECORD,
        craving: 20,
      };

      const craving = new TestAddiction(record).get(new ManualTime(record.since));

      expect(craving).toBe(20);
    });

    it('Возвращает выставленную тягу плюс скорость роста, умноженную на минуты от момента, когда её выставили, до переданного времени', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        craving: 20,
        since,
      });

      // При максимальной силе тяга растёт на 100 за сутки, а прошла четверть суток: она выросла на 25
      const craving = addiction.get(
        new ManualTime({
          ...since,
          hours: since.hours + 6,
        })
      );

      expect(craving).toBeCloseTo(45);
    });

    it('Считает прошедшее время через полночь', () => {
      const since = {
        day: 1,
        hours: 21,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        craving: 20,
        since,
      });

      // Прошло 6 часов, четверть суток: тяга выросла на 25
      const craving = addiction.get(
        new ManualTime({
          day: since.day + 1,
          hours: 3,
          minutes: 0,
        })
      );

      expect(craving).toBeCloseTo(45);
    });

    it('Не поднимает тягу выше BaseAddiction.MAX_CRAVING', () => {
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        craving: 90,
      });

      const craving = addiction.get(
        new ManualTime({
          ...DEFAULT_RECORD.since,
          day: DEFAULT_RECORD.since.day + 1,
        })
      );

      expect(craving).toBe(BaseAddiction.MAX_CRAVING);
    });

    it('Если время раньше момента, когда выставили тягу, возвращает выставленную тягу', () => {
      const since = {
        day: 2,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        craving: 20,
        since,
      });

      const craving = addiction.get(
        new ManualTime({
          ...since,
          day: since.day - 1,
        })
      );

      expect(craving).toBe(20);
    });
  });
});
