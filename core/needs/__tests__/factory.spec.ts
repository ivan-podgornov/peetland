import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import {
  createMockedNeedFactory,
  createMockedNeedsValidator,
  createNeedsDeps,
  createNeedValues,
} from '../dev';
import { Need, Needs, NeedsFactory } from '../src';

describe('NeedsFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Needs', () => {
      const factory = new NeedsFactory({
        time: new ManualTime(),
        ...createNeedsDeps(),
      });

      expect(factory.create(createNeedValues())).toBeInstanceOf(Needs);
    });

    it('Выставляет начальные значения на момент времени фабрики', () => {
      const factory = new NeedsFactory({
        time: new ManualTime({
          day: 2,
          hours: 9,
          minutes: 15,
        }),
        ...createNeedsDeps(),
      });

      const needs = factory.create(createNeedValues({ [Need.Satiety]: 80 }));

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
      const factory = new NeedsFactory({ time: new ManualTime() });
      function create() {
        return factory.create(createNeedValues({ [Need.Satiety]: -1 }));
      }

      expect(create).toThrow(RangeError);
    });

    it('Собирает потребности переданной фабрикой потребностей', () => {
      const needFactory = createMockedNeedFactory();

      new NeedsFactory({
        time: new ManualTime(),
        needFactory,
      }).create(createNeedValues());

      expect(needFactory.create).toHaveBeenCalledOnce();
    });

    it('Проверяет значения переданным валидатором', () => {
      const validator = createMockedNeedsValidator();

      new NeedsFactory({
        time: new ManualTime(),
        validator,
      }).create(createNeedValues());

      expect(validator.validateValue).toHaveBeenCalled();
    });
  });
});
