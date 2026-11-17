import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, Needs, NeedStatus } from '../src';

describe('Needs', () => {
  describe('#isUrgent', () => {
    it('Спрашивает статус потребности на момент переданного времени', () => {
      const need = createMockedNeed();
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });
      const time = new ManualTime();

      needs.isUrgent(Need.Satiety, time);

      expect(need.getStatus).toHaveBeenCalledExactlyOnceWith(time);
    });

    it('Если статус потребности NeedStatus.Urgent, возвращает true', () => {
      const need = createMockedNeed();
      need.getStatus.mockReturnValue(NeedStatus.Urgent);
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });

      expect(needs.isUrgent(Need.Satiety, new ManualTime())).toBe(true);
    });

    it('Если статус потребности NeedStatus.Moderate, возвращает false', () => {
      const need = createMockedNeed();
      need.getStatus.mockReturnValue(NeedStatus.Moderate);
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });

      expect(needs.isUrgent(Need.Satiety, new ManualTime())).toBe(false);
    });
  });
});
