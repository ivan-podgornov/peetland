import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#satisfy', () => {
    it('Прибавляет amount к значению на момент восполнения', () => {
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

      needs.satisfy(Need.Satiety, 20, time);

      expect(needs.get(Need.Satiety, time)).toBe(70);
    });

    it('Отсчитывает падение от момента восполнения', () => {
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

      needs.satisfy(
        Need.Satiety,
        20,
        new ManualTime({
          day: 1,
          hours: 10,
          minutes: 30,
        })
      );

      expect(needs.getState()[Need.Satiety]?.since).toStrictEqual({
        day: 1,
        hours: 10,
        minutes: 30,
      });
    });

    it('Не поднимает значение выше Needs.MAX_NEED', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 90,
            since,
          },
        },
        createNeedsDeps()
      );
      const time = new ManualTime(since);

      needs.satisfy(Need.Satiety, 50, time);

      expect(needs.get(Need.Satiety, time)).toBe(Needs.MAX_NEED);
    });

    it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если amount %s, выбрасывает RangeError',
      (amount) => {
        const needs = new Needs(
          {
            [Need.Satiety]: {
              value: 50,
              since: {
                day: 1,
                hours: 0,
                minutes: 0,
              },
            },
          },
          createNeedsDeps()
        );

        expect(() => needs.satisfy(Need.Satiety, amount, new ManualTime())).toThrow(RangeError);
      }
    );

    it('Если amount не подошёл, не меняет потребность', () => {
      const state = {
        [Need.Satiety]: {
          value: 50,
          since: {
            day: 1,
            hours: 0,
            minutes: 0,
          },
        },
      };
      const needs = new Needs(state, createNeedsDeps());

      expect(() => needs.satisfy(Need.Satiety, -1, new ManualTime())).toThrow(RangeError);
      expect(needs.getState()).toStrictEqual(state);
    });

    it('Если потребности у NPC нет, выбрасывает RangeError', () => {
      const needs = new Needs({}, createNeedsDeps());

      expect(() => needs.satisfy(Need.Satiety, 10, new ManualTime())).toThrow(RangeError);
    });
  });
});
