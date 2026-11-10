import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#getAll', () => {
    it('Возвращает значение каждой потребности на момент переданного времени', () => {
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: 80,
            since: {
              day: 1,
              hours: 10,
              minutes: 0,
            },
          },
        }),
        createNeedsDeps()
      );
      const time = new ManualTime({
        day: 1,
        hours: 12,
        minutes: 24,
      });

      const values = needs.getAll(time);

      expect(values).toStrictEqual({ [Need.Satiety]: needs.get(Need.Satiety, time) });
    });
  });
});
