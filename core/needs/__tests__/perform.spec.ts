import { FOOD, Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState } from '../dev';
import { Activity, FOOD_SATIETY, Need, Needs } from '../src';

describe('Needs', () => {
  describe('#perform', () => {
    describe('Если NPC поел', () => {
      it.each(FOOD)(
        'Прибавляет к сытости на момент, когда NPC поел, сколько восполняет еда (%s)',
        (food) => {
          const needs = new Needs(
            createNeedsState({
              [Need.Satiety]: {
                value: 25,
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
            hours: 16,
            minutes: 0,
          });

          needs.perform(Activity.Eat, { food }, time);

          // Сытость была 25, за 6 часов, четверть суток, упала на 25, а еда прибавила своё
          expect(needs.get(Need.Satiety, time)).toBeCloseTo(25 - 25 + FOOD_SATIETY[food]);
        }
      );

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
          { food: Item.Romashka },
          new ManualTime({
            day: 1,
            hours: 16,
            minutes: 0,
          })
        );

        expect(needs.getState()[Need.Satiety].since).toStrictEqual({
          day: 1,
          hours: 16,
          minutes: 0,
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

        needs.perform(Activity.Eat, { food: Item.Romashka }, time);

        expect(needs.get(Need.Satiety, time)).toBe(Needs.MAX_NEED);
      });
    });
  });
});
