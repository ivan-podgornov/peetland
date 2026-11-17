import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#get', () => {
    it('Возвращает значение, которое потребность посчитала на момент переданного времени', () => {
      const need = createMockedNeed();
      need.get.mockReturnValue(42);
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });
      const time = new ManualTime();

      const value = needs.get(Need.Satiety, time);

      expect(need.get).toHaveBeenCalledExactlyOnceWith(time);
      expect(value).toBe(42);
    });
  });
});
