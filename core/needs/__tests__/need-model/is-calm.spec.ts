import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState } from '../dev';
import { NEED_DEFINITIONS, Need, Needs } from '../src';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

/** Создаёт потребности, у которых сытость с момента since равна переданному значению */
function createNeedsWithSatiety(value: number) {
  return new Needs(
    createNeedsState({
      [Need.Satiety]: {
        value,
        since,
      },
    }),
    createNeedsDeps()
  );
}

describe('Needs', () => {
  describe('#isCalm', () => {
    it('Если значение выше порога спокойствия, возвращает true', () => {
      const needs = createNeedsWithSatiety(NEED_DEFINITIONS[Need.Satiety].calmAbove + 1);

      expect(needs.isCalm(Need.Satiety, new ManualTime(since))).toBe(true);
    });

    it('Если значение на пороге спокойствия, возвращает false', () => {
      const needs = createNeedsWithSatiety(NEED_DEFINITIONS[Need.Satiety].calmAbove);

      expect(needs.isCalm(Need.Satiety, new ManualTime(since))).toBe(false);
    });

    it('Считает спокойствие по значению на момент переданного времени', () => {
      const needs = createNeedsWithSatiety(NEED_DEFINITIONS[Need.Satiety].calmAbove + 1);

      // Через час сытость упала до порога спокойствия и ниже
      const value = needs.isCalm(
        Need.Satiety,
        new ManualTime({
          ...since,
          hours: 11,
        })
      );

      expect(value).toBe(false);
    });
  });
});
