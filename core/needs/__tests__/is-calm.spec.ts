import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeedModel, createNeedsDeps, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

const record = {
  value: 80,
  since: {
    day: 1,
    hours: 10,
    minutes: 0,
  },
};

describe('Needs', () => {
  describe('#isCalm', () => {
    it('Возвращает спокойствие, которое модель потребности посчитала по её записи и времени', () => {
      const model = createMockedNeedModel();
      model.isCalm.mockReturnValue(true);
      const needs = new Needs(
        createNeedsState({ [Need.Satiety]: record }),
        createNeedsDeps({ models: { [Need.Satiety]: model } })
      );
      const time = new ManualTime();

      const calm = needs.isCalm(Need.Satiety, time);

      expect(model.isCalm).toHaveBeenCalledExactlyOnceWith(record, time);
      expect(calm).toBe(true);
    });
  });
});
