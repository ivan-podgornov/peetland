import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#get', () => {
    it('Если время не прошло, возвращает выставленное значение', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: 80,
            since,
          },
        }),
        createNeedsDeps()
      );

      expect(needs.get(Need.Satiety, new ManualTime(since))).toBe(80);
    });

    it('Возвращает выставленное значение минус скорость падения, умноженную на минуты от момента, когда его выставили, до переданного времени', () => {
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

      // Сытость падает на 100 за сутки, а прошло 6 часов, четверть суток: она упала на 25
      const value = needs.get(
        Need.Satiety,
        new ManualTime({
          day: 1,
          hours: 16,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Считает прошедшее время через полночь', () => {
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: 80,
            since: {
              day: 1,
              hours: 21,
              minutes: 0,
            },
          },
        }),
        createNeedsDeps()
      );

      // С 21:00 до 03:00 следующего дня прошло 6 часов: сытость упала на 25
      const value = needs.get(
        Need.Satiety,
        new ManualTime({
          day: 2,
          hours: 3,
          minutes: 0,
        })
      );

      expect(value).toBeCloseTo(55);
    });

    it('Не опускает значение ниже Needs.MIN_NEED', () => {
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: 10,
            since: {
              day: 1,
              hours: 10,
              minutes: 0,
            },
          },
        }),
        createNeedsDeps()
      );

      // Прошли сутки: сытость упала бы на 100
      const value = needs.get(
        Need.Satiety,
        new ManualTime({
          day: 2,
          hours: 10,
          minutes: 0,
        })
      );

      expect(value).toBe(Needs.MIN_NEED);
    });

    it('Если время раньше момента, когда выставили значение, возвращает выставленное значение', () => {
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: 80,
            since: {
              day: 2,
              hours: 10,
              minutes: 0,
            },
          },
        }),
        createNeedsDeps()
      );

      const value = needs.get(
        Need.Satiety,
        new ManualTime({
          day: 1,
          hours: 10,
          minutes: 0,
        })
      );

      expect(value).toBe(80);
    });
  });
});
