import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#isUrgent', () => {
    it('Возвращает срочность, которую потребность посчитала на момент переданного времени', () => {
      const need = createMockedNeed();
      need.isUrgent.mockReturnValue(true);
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });
      const time = new ManualTime();

      const result = needs.isUrgent(Need.Satiety, time);

      expect(need.isUrgent).toHaveBeenCalledExactlyOnceWith(time);
      expect(result).toBe(true);
    });
  });
});
