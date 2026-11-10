import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#getAll', () => {
    it('Возвращает значение каждой потребности на момент переданного времени', () => {
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 80,
            since: {
              day: 1,
              hours: 10,
              minutes: 0,
            },
          },
        },
        createNeedsDeps()
      );

      const values = needs.getAll(
        new ManualTime({
          day: 1,
          hours: 10,
          minutes: 30,
        })
      );

      expect(values).toStrictEqual({ [Need.Satiety]: 50 });
    });

    it('Не возвращает потребности, которых у NPC нет', () => {
      const needs = new Needs({}, createNeedsDeps());

      expect(needs.getAll(new ManualTime())).toStrictEqual({});
    });
  });
});
