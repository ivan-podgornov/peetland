import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedAddiction, createMockedAddictionFactory, createAddictionsState } from '../dev';
import { Addiction, Addictions, AddictionStatus } from '../src';

describe('Addictions', () => {
  describe('#getStatus', () => {
    it('Возвращает статус, который зависимость посчитала на момент переданного времени', () => {
      const addiction = createMockedAddiction();
      addiction.getStatus.mockReturnValue(AddictionStatus.Urgent);
      const addictions = new Addictions(createAddictionsState(), {
        addictionFactory: createMockedAddictionFactory(addiction),
      });
      const time = new ManualTime();

      const status = addictions.getStatus(Addiction.Alcoholism, time);

      expect(addiction.getStatus).toHaveBeenCalledExactlyOnceWith(time);
      expect(status).toBe(AddictionStatus.Urgent);
    });
  });
});
