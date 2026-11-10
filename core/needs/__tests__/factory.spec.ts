import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedValues } from '../dev';
import { Need, Needs, NeedsFactory } from '../src';

describe('NeedsFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Needs', () => {
      const factory = new NeedsFactory(createNeedsDeps());

      expect(factory.create(createNeedValues(), new ManualTime())).toBeInstanceOf(Needs);
    });

    it('Выставляет начальные значения на момент переданного времени', () => {
      const factory = new NeedsFactory(createNeedsDeps());

      const needs = factory.create(
        createNeedValues({ [Need.Satiety]: 80 }),
        new ManualTime({
          day: 2,
          hours: 9,
          minutes: 15,
        })
      );

      expect(needs.getState()).toStrictEqual({
        [Need.Satiety]: {
          value: 80,
          since: {
            day: 2,
            hours: 9,
            minutes: 15,
          },
        },
      });
    });

    it('Если валидатор не передан, проверяет значения NeedsValidator', () => {
      const factory = new NeedsFactory();
      function create() {
        return factory.create(createNeedValues({ [Need.Satiety]: -1 }), new ManualTime());
      }

      expect(create).toThrow(RangeError);
    });
  });
});
