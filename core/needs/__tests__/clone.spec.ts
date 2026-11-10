import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#clone', () => {
    it('Возвращает потребности с тем же состоянием', () => {
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

      expect(needs.clone().getState()).toStrictEqual(needs.getState());
    });

    it('Копия падает с той же скоростью', () => {
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
      const time = new ManualTime({
        day: 1,
        hours: 10,
        minutes: 30,
      });

      expect(needs.clone().get(Need.Satiety, time)).toBe(needs.get(Need.Satiety, time));
    });

    it('Восполнение копии не меняет исходные потребности', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 50,
            since,
          },
        },
        createNeedsDeps()
      );
      const time = new ManualTime(since);

      needs.clone().satisfy(Need.Satiety, 30, time);

      expect(needs.get(Need.Satiety, time)).toBe(50);
    });

    it('Восполнение исходных потребностей не меняет копию', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 50,
            since,
          },
        },
        createNeedsDeps()
      );
      const copy = needs.clone();
      const time = new ManualTime(since);

      needs.satisfy(Need.Satiety, 30, time);

      expect(copy.get(Need.Satiety, time)).toBe(50);
    });
  });
});
