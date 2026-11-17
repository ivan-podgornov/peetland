import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';
import { BaseNeed } from '../../src/base-need';

describe('BaseNeed', () => {
  describe('#get', () => {
    it('Если время не прошло, возвращает выставленное значение', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 80,
      };

      const value = new TestNeed(record).get(new ManualTime(record.since));

      expect(value).toBe(80);
    });

    it('Возвращает выставленное значение минус скорость падения, умноженную на минуты от момента, когда его выставили, до переданного времени', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const need = new TestNeed({
        value: 80,
        since,
      });

      // Потребность падает на 100 за сутки, а прошла четверть суток: она упала на 25
      const value = need.get(
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
      const need = new TestNeed({
        value: 80,
        since,
      });

      // Прошло 6 часов, четверть суток: потребность упала на 25
      const value = need.get(
        new ManualTime({
          day: since.day + 1,
          hours: 3,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Не опускает значение ниже BaseNeed.MIN_NEED', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const need = new TestNeed({
        value: 10,
        since,
      });

      const value = need.get(
        new ManualTime({
          ...since,
          day: since.day + 1,
        })
      );

      expect(value).toBe(BaseNeed.MIN_NEED);
    });

    it('Если время раньше момента, когда выставили значение, возвращает выставленное значение', () => {
      const since = {
        day: 2,
        hours: 10,
        minutes: 0,
      };
      const need = new TestNeed({
        value: 80,
        since,
      });

      const value = need.get(
        new ManualTime({
          ...since,
          day: since.day - 1,
        })
      );

      expect(value).toBe(80);
    });
  });
});
