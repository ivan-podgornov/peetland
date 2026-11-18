import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('#get', () => {
    it('Если время не прошло, возвращает выставленную удовлетворённость', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: 80,
      };

      const value = new TestAddiction(record).get(new ManualTime(record.since));

      expect(value).toBe(80);
    });

    it('Возвращает выставленную удовлетворённость минус скорость падения, умноженную на минуты от момента, когда её выставили, до переданного времени', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        satisfaction: 80,
        strength: BaseAddiction.MAX_STRENGTH,
        since,
      });

      // При максимальной силе удовлетворённость падает на 100 за сутки, а прошла четверть суток: она упала на 25
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
        satisfaction: 80,
        strength: BaseAddiction.MAX_STRENGTH,
        since,
      });

      // Прошло 6 часов, четверть суток: удовлетворённость упала на 25
      const value = addiction.get(
        new ManualTime({
          day: since.day + 1,
          hours: 3,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Не опускает удовлетворённость ниже BaseAddiction.MIN_SATISFACTION', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        satisfaction: 10,
        strength: BaseAddiction.MAX_STRENGTH,
        since,
      });

      const value = addiction.get(
        new ManualTime({
          ...since,
          day: since.day + 1,
        })
      );

      expect(value).toBe(BaseAddiction.MIN_SATISFACTION);
    });

    it('Если время раньше момента, когда выставили удовлетворённость, возвращает выставленную удовлетворённость', () => {
      const since = {
        day: 2,
        hours: 10,
        minutes: 0,
      };
      const addiction = new TestAddiction({
        satisfaction: 80,
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
