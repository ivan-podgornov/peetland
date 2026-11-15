import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TestNeedModel } from '../../dev';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

describe('NeedModel', () => {
  describe('#isUrgent', () => {
    it('Если значение ниже порога срочности, возвращает true', () => {
      const model = new TestNeedModel();

      const urgent = model.isUrgent(
        {
          value: model.urgentBelow - 1,
          since,
        },
        new ManualTime(since)
      );

      expect(urgent).toBe(true);
    });

    it('Если значение на пороге срочности, возвращает false', () => {
      const model = new TestNeedModel();

      const urgent = model.isUrgent(
        {
          value: model.urgentBelow,
          since,
        },
        new ManualTime(since)
      );

      expect(urgent).toBe(false);
    });

    it('Считает срочность по значению на момент переданного времени', () => {
      const model = new TestNeedModel();

      // Через час потребность упала ниже порога
      const urgent = model.isUrgent(
        {
          value: model.urgentBelow,
          since,
        },
        new ManualTime({
          ...since,
          hours: 11,
        })
      );

      expect(urgent).toBe(true);
    });
  });
});
