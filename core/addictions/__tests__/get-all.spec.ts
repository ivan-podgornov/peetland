import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createAddictionsDeps, createAddictionsState } from '../dev';
import { Addiction, Addictions } from '../src';
import { BaseAddiction } from '../src/base-addiction';

describe('Addictions', () => {
  describe('#getAll', () => {
    it('Возвращает тягу каждой зависимости на момент переданного времени', () => {
      const addictions = new Addictions(
        createAddictionsState({
          [Addiction.Alcoholism]: {
            craving: 80,
            strength: BaseAddiction.MAX_STRENGTH,
            since: {
              day: 1,
              hours: 10,
              minutes: 0,
            },
          },
        }),
        createAddictionsDeps()
      );
      const time = new ManualTime({
        day: 1,
        hours: 16,
        minutes: 0,
      });

      const values = addictions.getAll(time);

      expect(values).toStrictEqual({
        [Addiction.Alcoholism]: addictions.get(Addiction.Alcoholism, time),
      });
    });
  });
});
