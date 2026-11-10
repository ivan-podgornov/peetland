import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState } from '../dev';
import { Activity, Need, Needs } from '../src';
import { EAT_SATIETY } from '../src/constants';

describe('Needs', () => {
  describe('#perform', () => {
    describe('Если NPC поел', () => {
      it('Прибавляет EAT_SATIETY к сытости на момент, когда NPC поел', () => {
        const needs = new Needs(
          createNeedsState({
            [Need.Satiety]: {
              value: 50,
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

        needs.perform(Activity.Eat, {}, time);

        // Сытость была 50, за 144 минуты упала на 10, а еда прибавила EAT_SATIETY
        expect(needs.get(Need.Satiety, time)).toBeCloseTo(50 - 10 + EAT_SATIETY);
      });

      it('Отсчитывает падение сытости от момента, когда NPC поел', () => {
        const needs = new Needs(
          createNeedsState({
            [Need.Satiety]: {
              value: 50,
              since: {
                day: 1,
                hours: 10,
                minutes: 0,
              },
            },
          }),
          createNeedsDeps()
        );

        needs.perform(
          Activity.Eat,
          {},
          new ManualTime({
            day: 1,
            hours: 12,
            minutes: 24,
          })
        );

        expect(needs.getState()[Need.Satiety].since).toStrictEqual({
          day: 1,
          hours: 12,
          minutes: 24,
        });
      });

      it('Не поднимает сытость выше Needs.MAX_NEED', () => {
        const since = {
          day: 1,
          hours: 10,
          minutes: 0,
        };
        const needs = new Needs(
          createNeedsState({
            [Need.Satiety]: {
              value: Needs.MAX_NEED - 1,
              since,
            },
          }),
          createNeedsDeps()
        );
        const time = new ManualTime(since);

        needs.perform(Activity.Eat, {}, time);

        expect(needs.get(Need.Satiety, time)).toBe(Needs.MAX_NEED);
      });
    });
  });
});
