import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState } from '../dev';
import { NEED_DEFINITIONS, Need, Needs } from '../src';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

describe('Needs', () => {
  describe('#isUrgent', () => {
    it('Если значение ниже порога срочности, возвращает true', () => {
      const { urgentBelow } = NEED_DEFINITIONS[Need.Satiety];
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: urgentBelow - 1,
            since,
          },
        }),
        createNeedsDeps()
      );

      expect(needs.isUrgent(Need.Satiety, new ManualTime(since))).toBe(true);
    });

    it('Если значение на пороге срочности, возвращает false', () => {
      const { urgentBelow } = NEED_DEFINITIONS[Need.Satiety];
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: urgentBelow,
            since,
          },
        }),
        createNeedsDeps()
      );

      expect(needs.isUrgent(Need.Satiety, new ManualTime(since))).toBe(false);
    });

    it('Считает срочность по значению на момент переданного времени', () => {
      const { urgentBelow } = NEED_DEFINITIONS[Need.Satiety];
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: urgentBelow,
            since,
          },
        }),
        createNeedsDeps()
      );

      // Через час сытость упала ниже порога
      const value = needs.isUrgent(
        Need.Satiety,
        new ManualTime({
          ...since,
          hours: 11,
        })
      );

      expect(value).toBe(true);
    });
  });
});
