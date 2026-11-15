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
  describe('#get', () => {
    it('Возвращает значение, которое модель потребности посчитала по её записи и времени', () => {
      const model = createMockedNeedModel();
      model.get.mockReturnValue(42);
      const needs = new Needs(
        createNeedsState({ [Need.Satiety]: record }),
        createNeedsDeps({ models: { [Need.Satiety]: model } })
      );
      const time = new ManualTime();

      const value = needs.get(Need.Satiety, time);

      expect(model.get).toHaveBeenCalledExactlyOnceWith(record, time);
      expect(value).toBe(42);
    });
  });
});
