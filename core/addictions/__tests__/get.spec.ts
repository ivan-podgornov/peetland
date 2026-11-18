import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedAddiction, createMockedAddictionFactory, createAddictionsState } from '../dev';
import { Addiction, Addictions } from '../src';

describe('Addictions', () => {
  describe('#get', () => {
    it('Возвращает тягу, которую зависимость посчитала на момент переданного времени', () => {
      const addiction = createMockedAddiction();
      addiction.get.mockReturnValue(42);
      const addictions = new Addictions(createAddictionsState(), {
        addictionFactory: createMockedAddictionFactory(addiction),
      });
      const time = new ManualTime();

      const value = addictions.get(Addiction.Alcoholism, time);

      expect(addiction.get).toHaveBeenCalledExactlyOnceWith(time);
      expect(value).toBe(42);
    });
  });
});
