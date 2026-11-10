import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState } from '../dev';
import { Activity, Need, Needs } from '../src';

describe('Needs', () => {
  describe('#clone', () => {
    it('Возвращает потребности с тем же состоянием', () => {
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

      expect(needs.clone().getState()).toStrictEqual(needs.getState());
    });

    it('Занятие в копии не меняет исходные потребности', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: 50,
            since,
          },
        }),
        createNeedsDeps()
      );
      const time = new ManualTime(since);

      needs.clone().perform(Activity.Eat, {}, time);

      expect(needs.get(Need.Satiety, time)).toBe(50);
    });

    it('Занятие в исходных потребностях не меняет копию', () => {
      const since = {
        day: 1,
        hours: 10,
        minutes: 0,
      };
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            value: 50,
            since,
          },
        }),
        createNeedsDeps()
      );
      const copy = needs.clone();
      const time = new ManualTime(since);

      needs.perform(Activity.Eat, {}, time);

      expect(copy.get(Need.Satiety, time)).toBe(50);
    });
  });
});
