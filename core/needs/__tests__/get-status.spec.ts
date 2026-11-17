import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, Needs, NeedStatus } from '../src';

describe('Needs', () => {
  describe('#getStatus', () => {
    it('Возвращает статус, который потребность посчитала на момент переданного времени', () => {
      const need = createMockedNeed();
      need.getStatus.mockReturnValue(NeedStatus.Urgent);
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });
      const time = new ManualTime();

      const status = needs.getStatus(Need.Satiety, time);

      expect(need.getStatus).toHaveBeenCalledExactlyOnceWith(time);
      expect(status).toBe(NeedStatus.Urgent);
    });
  });
});
