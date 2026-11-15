import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#isCalm', () => {
    it('Возвращает спокойствие, которое потребность посчитала на момент переданного времени', () => {
      const need = createMockedNeed();
      need.isCalm.mockReturnValue(true);
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });
      const time = new ManualTime();

      const result = needs.isCalm(Need.Satiety, time);

      expect(need.isCalm).toHaveBeenCalledExactlyOnceWith(time);
      expect(result).toBe(true);
    });
  });
});
