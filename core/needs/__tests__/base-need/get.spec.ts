import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TestNeed } from '../../dev';
import { BaseNeed } from '../../src';

describe('BaseNeed', () => {
  describe('#get', () => {
    it('Если время не прошло, возвращает выставленное значение', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };

      const value = new TestNeed({
        value: 80,
        since,
      }).get(new ManualTime(since));

      expect(value).toBe(80);
    });

    it('Возвращает выставленное значение минус скорость падения, умноженную на минуты от момента, когда его выставили, до переданного времени', () => {
      const need = new TestNeed({
        value: 80,
        since: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      });

      // Потребность падает на 100 за сутки, а прошло 6 часов, четверть суток: она упала на 25
      const value = need.get(
        new ManualTime({
          day: 1,
          hours: 16,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Считает прошедшее время через полночь', () => {
      const need = new TestNeed({
        value: 80,
        since: {
          day: 1,
          hours: 21,
          minutes: 0,
        },
      });

      // С 21:00 до 03:00 следующего дня прошло 6 часов: потребность упала на 25
      const value = need.get(
        new ManualTime({
          day: 2,
          hours: 3,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Не опускает значение ниже BaseNeed.MIN_NEED', () => {
      const need = new TestNeed({
        value: 10,
        since: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      });

      // Прошли сутки: потребность упала бы на 100
      const value = need.get(
        new ManualTime({
          day: 2,
          hours: 10,
          minutes: 0,
        })
      );

      expect(value).toBe(BaseNeed.MIN_NEED);
    });

    it('Если время раньше момента, когда выставили значение, возвращает выставленное значение', () => {
      const need = new TestNeed({
        value: 80,
        since: {
          day: 2,
          hours: 10,
          minutes: 0,
        },
      });

      const value = need.get(
        new ManualTime({
          day: 1,
          hours: 10,
          minutes: 0,
        })
      );

      expect(value).toBe(80);
    });
  });
});
