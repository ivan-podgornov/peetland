import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps } from '../dev';
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
        {
          [Need.Satiety]: {
            value: 80,
            since,
          },
        },
        createNeedsDeps()
      );

      expect(needs.get(Need.Satiety, new ManualTime(since))).toBe(80);
    });

    it('Возвращает значение, которое упало по скорости падения за прошедшие минуты', () => {
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
        createNeedsDeps({
          definitions: {
            [Need.Satiety]: {
              ...createNeedsDeps().definitions[Need.Satiety],
              depletionMinutes: 200,
            },
          },
        })
      );

      const value = needs.get(
        Need.Satiety,
        new ManualTime({
          day: 1,
          hours: 10,
          minutes: 30,
        })
      );

      expect(value).toBe(65);
    });

    it('Считает прошедшее время через полночь', () => {
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 80,
            since: {
              day: 1,
              hours: 23,
              minutes: 50,
            },
          },
        },
        createNeedsDeps()
      );

      const value = needs.get(
        Need.Satiety,
        new ManualTime({
          day: 2,
          hours: 0,
          minutes: 10,
        })
      );

      expect(value).toBe(60);
    });

    it('Не опускает значение ниже Needs.MIN_NEED', () => {
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 10,
            since: {
              day: 1,
              hours: 10,
              minutes: 0,
            },
          },
        },
        createNeedsDeps()
      );

      const value = needs.get(
        Need.Satiety,
        new ManualTime({
          day: 1,
          hours: 12,
          minutes: 0,
        })
      );

      expect(value).toBe(Needs.MIN_NEED);
    });

    it('Если время раньше момента, когда выставили значение, возвращает выставленное значение', () => {
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 80,
            since: {
              day: 2,
              hours: 10,
              minutes: 0,
            },
          },
        },
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

    it('Возвращает значение на момент переданного времени, а не времени, когда читали прошлый раз', () => {
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
        minutes: 0,
      });
      const later = time.clone();
      later.set({
        day: 1,
        hours: 10,
        minutes: 20,
      });

      needs.get(Need.Satiety, later);

      expect(needs.get(Need.Satiety, time)).toBe(80);
    });

    it('Если потребности у NPC нет, выбрасывает RangeError', () => {
      const needs = new Needs({}, createNeedsDeps());

      expect(() => needs.get(Need.Satiety, new ManualTime())).toThrow(RangeError);
    });
  });
});
