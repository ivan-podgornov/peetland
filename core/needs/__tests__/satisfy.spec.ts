import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator, createNeedsDeps, createNeedsState } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#satisfy', () => {
    it('Прибавляет amount к значению на момент восполнения', () => {
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

      needs.satisfy(
        Need.Satiety,
        20,
        new ManualTime({
          day: 1,
          hours: 10,
          minutes: 30,
        })
      );

      expect(needs.getState()[Need.Satiety].since).toStrictEqual({
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
        createNeedsState({
          [Need.Satiety]: {
            value: 90,
            since,
          },
        }),
        createNeedsDeps()
      );
      const time = new ManualTime(since);

      needs.satisfy(Need.Satiety, 50, time);

      expect(needs.get(Need.Satiety, time)).toBe(Needs.MAX_NEED);
    });

    it('Проверяет amount валидатором', () => {
      const validator = createMockedNeedsValidator();
      const needs = new Needs(createNeedsState(), createNeedsDeps({ validator }));

      needs.satisfy(Need.Satiety, 20, new ManualTime());

      expect(validator.validateAmount).toHaveBeenCalledExactlyOnceWith(20);
    });

    it('Если валидатор выбросил ошибку на amount, выбрасывает ту же ошибку', () => {
      const error = new RangeError('восполнение');
      const validator = createMockedNeedsValidator();
      validator.validateAmount.mockImplementation(() => {
        throw error;
      });
      const needs = new Needs(createNeedsState(), createNeedsDeps({ validator }));
      function satisfy() {
        needs.satisfy(Need.Satiety, -1, new ManualTime());
      }

      expect(satisfy).toThrow(error);
    });

    it('Если валидатор выбросил ошибку на amount, не меняет потребность', () => {
      const state = createNeedsState();
      const validator = createMockedNeedsValidator();
      validator.validateAmount.mockImplementation(() => {
        throw new RangeError('восполнение');
      });
      const needs = new Needs(state, createNeedsDeps({ validator }));
      function satisfy() {
        needs.satisfy(Need.Satiety, -1, new ManualTime());
      }

      expect(satisfy).toThrow(RangeError);
      expect(needs.getState()).toStrictEqual(state);
    });
  });
});
