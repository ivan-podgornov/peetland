import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedValues } from '../dev';
import { NEED_DEFINITIONS, Need, Needs, NeedsFactory } from '../src';

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

    it('Если описания не переданы, потребности падают по NEED_DEFINITIONS', () => {
      const factory = new NeedsFactory();
      const needs = factory.create(
        createNeedValues({ [Need.Satiety]: Needs.MAX_NEED }),
        new ManualTime({
          day: 1,
          hours: 0,
          minutes: 0,
        })
      );
      const later = new ManualTime({
        day: 1,
        hours: 0,
        minutes: 30,
      });

      expect(needs.get(Need.Satiety, later)).toBeCloseTo(
        Needs.MAX_NEED - (Needs.MAX_NEED / NEED_DEFINITIONS[Need.Satiety].depletionMinutes) * 30
      );
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
