import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('#get', () => {
    it('Если время не прошло, возвращает выставленное значение', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 80,
      };

      const value = new TestAddiction(record).get(new ManualTime(record.since));

      expect(value).toBe(80);
    });

    it('Возвращает выставленное значение минус скорость падения, умноженную на минуты от момента, когда его выставили, до переданного времени', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        value: 80,
        strength: BaseAddiction.MAX_STRENGTH,
        since,
      });

      // Зависимость падает на 100 за сутки, а прошла четверть суток: она упала на 25
      const value = addiction.get(
        new ManualTime({
          ...since,
          hours: since.hours + 6,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Считает прошедшее время через полночь', () => {
      const since = {
        day: 1,
        hours: 21,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        value: 80,
        strength: BaseAddiction.MAX_STRENGTH,
        since,
      });

      // Прошло 6 часов, четверть суток: зависимость упала на 25
      const value = addiction.get(
        new ManualTime({
          day: since.day + 1,
          hours: 3,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Не опускает значение ниже BaseAddiction.MIN_VALUE', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        value: 10,
        strength: BaseAddiction.MAX_STRENGTH,
        since,
      });

      const value = addiction.get(
        new ManualTime({
          ...since,
          day: since.day + 1,
        })
      );

      expect(value).toBe(BaseAddiction.MIN_VALUE);
    });

    it('Если время раньше момента, когда выставили значение, возвращает выставленное значение', () => {
      const since = {
        day: 2,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        value: 80,
        strength: BaseAddiction.MAX_STRENGTH,
        since,
      });

      const value = addiction.get(
        new ManualTime({
          ...since,
          day: since.day - 1,
        })
      );

      expect(value).toBe(80);
    });
  });
});
