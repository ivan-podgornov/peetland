import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TestNeedModel } from '../../dev';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

describe('NeedModel', () => {
  describe('#isCalm', () => {
    it('Если значение выше порога спокойствия, возвращает true', () => {
      const model = new TestNeedModel();

      const calm = model.isCalm(
        {
          value: model.calmAbove + 1,
          since,
        },
        new ManualTime(since)
      );

      expect(calm).toBe(true);
    });

    it('Если значение на пороге спокойствия, возвращает false', () => {
      const model = new TestNeedModel();

      const calm = model.isCalm(
        {
          value: model.calmAbove,
          since,
        },
        new ManualTime(since)
      );

      expect(calm).toBe(false);
    });

    it('Считает спокойствие по значению на момент переданного времени', () => {
      const model = new TestNeedModel();

      // Через час потребность упала до порога спокойствия и ниже
      const calm = model.isCalm(
        {
          value: model.calmAbove + 1,
          since,
        },
        new ManualTime({
          ...since,
          hours: 11,
        })
      );

      expect(calm).toBe(false);
    });
  });
});
